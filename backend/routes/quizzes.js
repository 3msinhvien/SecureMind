const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/quizzes
// @desc    Lấy danh sách tất cả bài quiz
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { type, difficulty, category } = req.query;

        let filter = { isActive: true };

        if (type) filter.type = type;
        if (difficulty) filter.difficulty = difficulty;
        if (category) filter.category = category;

        const quizzes = await Quiz.find(filter)
            .select('-questions.correctAnswer -questions.expectedOutput')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/quizzes/:id
// @desc    Lấy chi tiết một bài quiz
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .select('-questions.correctAnswer -questions.expectedOutput');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài quiz'
            });
        }

        res.json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/quizzes
// @desc    Tạo bài quiz mới (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);

        res.status(201).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/quizzes/:id
// @desc    Cập nhật bài quiz (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài quiz'
            });
        }

        res.json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/quizzes/:id
// @desc    Xóa bài quiz (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài quiz'
            });
        }

        res.json({
            success: true,
            message: 'Đã xóa bài quiz'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
