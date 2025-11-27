const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { gradeMultipleChoice, gradeCommand } = require('../utils/helpers');

// @route   POST /api/submissions
// @desc    Nộp bài làm
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { quizId, answers, timeSpent, startedAt } = req.body;

        // Lấy thông tin quiz với câu trả lời đúng
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài quiz'
            });
        }

        // Chấm điểm
        let totalScore = 0;
        const gradedAnswers = [];

        for (let i = 0; i < answers.length; i++) {
            const userAnswer = answers[i];
            const question = quiz.questions.id(userAnswer.questionId);

            if (!question) continue;

            let isCorrect = false;
            let pointsEarned = 0;

            if (question.questionType === 'command') {
                // Chấm câu thực hành
                isCorrect = gradeCommand(
                    userAnswer.answer,
                    question.expectedOutput,
                    question.testCases
                );
            } else {
                // Chấm câu trắc nghiệm
                isCorrect = gradeMultipleChoice(
                    userAnswer.answer,
                    question.correctAnswer
                );
            }

            if (isCorrect) {
                pointsEarned = question.points;
                totalScore += pointsEarned;
            }

            gradedAnswers.push({
                questionId: question._id,
                answer: userAnswer.answer,
                isCorrect,
                pointsEarned
            });
        }

        const percentage = (totalScore / quiz.totalPoints) * 100;
        const passed = percentage >= quiz.passingScore;

        // Tạo submission
        const submission = await Submission.create({
            user: req.user._id,
            quiz: quizId,
            answers: gradedAnswers,
            score: totalScore,
            totalPoints: quiz.totalPoints,
            percentage: Math.round(percentage * 100) / 100,
            passed,
            timeSpent,
            startedAt
        });

        // Cập nhật điểm của user
        const user = await User.findById(req.user._id);

        // Chỉ cộng điểm nếu chưa làm bài này trước đó
        const existingSubmission = await Submission.findOne({
            user: req.user._id,
            quiz: quizId,
            _id: { $ne: submission._id }
        });

        if (!existingSubmission) {
            user.completedQuizzes.push(quizId);
            user.totalScore += totalScore;
            await user.save();
        }

        // Populate submission với thông tin quiz và câu hỏi
        await submission.populate('quiz', 'title type difficulty');

        res.status(201).json({
            success: true,
            data: submission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/submissions/user/:userId
// @desc    Lấy lịch sử làm bài của user
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
    try {
        // User chỉ có thể xem lịch sử của mình, trừ khi là admin
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền truy cập'
            });
        }

        const submissions = await Submission.find({ user: req.params.userId })
            .populate('quiz', 'title type difficulty category')
            .sort({ submittedAt: -1 });

        res.json({
            success: true,
            count: submissions.length,
            data: submissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/submissions/quiz/:quizId
// @desc    Lấy tất cả submissions của một quiz (Admin only)
// @access  Private/Admin
router.get('/quiz/:quizId', protect, async (req, res) => {
    try {
        const submissions = await Submission.find({ quiz: req.params.quizId })
            .populate('user', 'username fullName studentId')
            .sort({ score: -1 });

        res.json({
            success: true,
            count: submissions.length,
            data: submissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/submissions/:id
// @desc    Lấy chi tiết một submission
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('quiz')
            .populate('user', 'username fullName studentId');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài làm'
            });
        }

        // User chỉ có thể xem submission của mình
        if (submission.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền truy cập'
            });
        }

        res.json({
            success: true,
            data: submission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
