const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Vui lòng nhập tiêu đề bài kiểm tra']
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['multiple-choice', 'practical'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    timeLimit: {
        type: Number, // Phút
        required: true
    },
    passingScore: {
        type: Number,
        default: 70
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        questionType: {
            type: String,
            enum: ['single-choice', 'multiple-choice', 'command'],
            required: true
        },
        options: [String], // Cho câu trắc nghiệm
        correctAnswer: mongoose.Schema.Types.Mixed, // String hoặc Array
        points: {
            type: Number,
            default: 10
        },
        explanation: String,
        // Cho câu thực hành
        commandHint: String,
        expectedOutput: String,
        testCases: [{
            input: String,
            expectedOutput: String
        }]
    }],
    totalPoints: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['cryptography', 'network-security', 'web-security', 'malware', 'tools', 'general'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema);
