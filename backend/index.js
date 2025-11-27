require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB đã kết nối'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// API test
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API Cybersecurity Quiz hoạt động tốt!'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Đã có lỗi xảy ra!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
