const jwt = require('jsonwebtoken');

// Tạo JWT token
exports.generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Chấm điểm câu trắc nghiệm
exports.gradeMultipleChoice = (userAnswer, correctAnswer) => {
    if (Array.isArray(correctAnswer)) {
        // Multiple answers
        if (!Array.isArray(userAnswer)) return false;
        if (userAnswer.length !== correctAnswer.length) return false;
        return userAnswer.sort().join(',') === correctAnswer.sort().join(',');
    } else {
        // Single answer
        return userAnswer === correctAnswer;
    }
};

// Chấm điểm câu thực hành (command)
exports.gradeCommand = (userCommand, expectedOutput, testCases) => {
    // Đơn giản hóa: so sánh command hoặc output
    // Trong thực tế, có thể execute command và kiểm tra output
    if (expectedOutput) {
        return userCommand.trim().toLowerCase() === expectedOutput.trim().toLowerCase();
    }

    if (testCases && testCases.length > 0) {
        // Kiểm tra test cases
        return testCases.every(tc => {
            return userCommand.includes(tc.expectedOutput);
        });
    }

    return false;
};
