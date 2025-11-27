const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const { protect } = require('../middleware/auth');

// @route   GET /api/leaderboard
// @desc    Lấy bảng xếp hạng
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        // Lấy top users theo tổng điểm
        const users = await User.find()
            .select('username fullName studentId totalScore completedQuizzes')
            .sort({ totalScore: -1 })
            .limit(parseInt(limit));

        // Thêm thông tin rank
        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            fullName: user.fullName,
            studentId: user.studentId,
            totalScore: user.totalScore,
            completedQuizzes: user.completedQuizzes.length
        }));

        res.json({
            success: true,
            count: leaderboard.length,
            data: leaderboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/leaderboard/quiz/:quizId
// @desc    Lấy bảng xếp hạng cho một bài quiz cụ thể
// @access  Private
router.get('/quiz/:quizId', protect, async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        // Lấy submissions tốt nhất cho quiz này
        const submissions = await Submission.aggregate([
            { $match: { quiz: req.params.quizId } },
            { $sort: { score: -1 } },
            {
                $group: {
                    _id: '$user',
                    bestScore: { $first: '$score' },
                    percentage: { $first: '$percentage' },
                    passed: { $first: '$passed' },
                    submittedAt: { $first: '$submittedAt' }
                }
            },
            { $sort: { bestScore: -1 } },
            { $limit: parseInt(limit) }
        ]);

        // Populate user info
        const leaderboard = await User.populate(submissions, {
            path: '_id',
            select: 'username fullName studentId'
        });

        const formattedLeaderboard = leaderboard.map((item, index) => ({
            rank: index + 1,
            username: item._id.username,
            fullName: item._id.fullName,
            studentId: item._id.studentId,
            score: item.bestScore,
            percentage: item.percentage,
            passed: item.passed,
            submittedAt: item.submittedAt
        }));

        res.json({
            success: true,
            count: formattedLeaderboard.length,
            data: formattedLeaderboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/leaderboard/stats
// @desc    Lấy thống kê tổng quan
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSubmissions = await Submission.countDocuments();

        const avgScore = await Submission.aggregate([
            {
                $group: {
                    _id: null,
                    averageScore: { $avg: '$percentage' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalSubmissions,
                averageScore: avgScore[0]?.averageScore || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
