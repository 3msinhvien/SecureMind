const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Đăng ký user mới
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, fullName, studentId } = req.body;

        // Kiểm tra user đã tồn tại
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Username hoặc email đã tồn tại'
            });
        }

        // Tạo user mới
        const user = await User.create({
            username,
            email,
            password,
            fullName,
            studentId
        });

        // Tạo token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                totalScore: user.totalScore
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/auth/login
// @desc    Đăng nhập
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập username và password'
            });
        }

        // Tìm user và include password
        const user = await User.findOne({ username }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Thông tin đăng nhập không chính xác'
            });
        }

        // Kiểm tra password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Thông tin đăng nhập không chính xác'
            });
        }

        // Tạo token
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                totalScore: user.totalScore
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/auth/me
// @desc    Lấy thông tin user hiện tại
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        // req.user được set từ middleware protect
        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
