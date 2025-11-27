const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    answers: [{
        questionId: mongoose.Schema.Types.ObjectId,
        answer: mongoose.Schema.Types.Mixed, // String hoặc Array
        isCorrect: Boolean,
        pointsEarned: Number
    }],
    score: {
        type: Number,
        required: true
    },
    totalPoints: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    passed: {
        type: Boolean,
        required: true
    },
    timeSpent: {
        type: Number, // Giây
        required: true
    },
    startedAt: {
        type: Date,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Index để tăng tốc query
submissionSchema.index({ user: 1, quiz: 1 });
submissionSchema.index({ score: -1 });

module.exports = mongoose.model('Submission', submissionSchema);
