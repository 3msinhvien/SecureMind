# 🔒 Cybersecurity Quiz System

Hệ thống kiểm tra trực tuyến cho sinh viên chuyên ngành An toàn thông tin

## ✨ Tính năng

### 1. Hệ thống bài kiểm tra
- **Trắc nghiệm**: 6 bài kiểm tra trắc nghiệm về các chủ đề:
  - Mật mã học cơ bản
  - An toàn mạng và Firewall
  - Web Security và OWASP Top 10
  - Malware và Phân tích mã độc
  - Penetration Testing
  - Security Compliance và Standards

- **Thực hành**: 6 bài kiểm tra thực hành với các công cụ:
  - Nmap (Network Scanning)
  - Wireshark (Packet Analysis)
  - SQLMap (SQL Injection Testing)
  - John the Ripper (Password Cracking)
  - Metasploit Framework
  - Linux Security Commands

### 2. Tính năng khác
- 🔐 Đăng nhập/Đăng ký với JWT authentication
- 📊 Dashboard hiển thị thống kê cá nhân
- ⏱️ Đếm ngược thời gian làm bài
- 📝 Xem chi tiết kết quả từng câu với giải thích
- 🏆 Bảng xếp hạng toàn hệ thống
- 📈 Lịch sử làm bài
- 💯 Chấm điểm tự động

## 🛠️ Công nghệ sử dụng

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (Password hashing)

### Frontend
- React + Vite
- React Router DOM
- Axios
- CSS3 (Responsive design)

## 📦 Cài đặt

### Yêu cầu
- Node.js (v14 trở lên)
- MongoDB (v4.4 trở lên)
- npm hoặc yarn

### Bước 1: Clone repository
```bash
cd myapp
```

### Bước 2: Cài đặt Backend
```bash
cd backend
npm install
```

### Bước 3: Cấu hình Backend
File `.env` đã được tạo sẵn với cấu hình:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cybersecurity-quiz
JWT_SECRET=your-secret-key-change-in-production-123456789
JWT_EXPIRE=7d
```

### Bước 4: Cài đặt Frontend
```bash
cd ../frontend
npm install
```

## 🚀 Khởi động ứng dụng

### 1. Khởi động MongoDB
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### 2. Load dữ liệu mẫu
```bash
cd backend
npm run seed
```

Kết quả sẽ tạo:
- 1 tài khoản admin
- 4 tài khoản sinh viên mẫu
- 6 bài kiểm tra trắc nghiệm
- 6 bài kiểm tra thực hành

### 3. Khởi động Backend Server
```bash
cd backend
npm run dev
```
Server sẽ chạy tại: http://localhost:5000

### 4. Khởi động Frontend
```bash
cd frontend
npm run dev
```
Frontend sẽ chạy tại: http://localhost:5173

## 👤 Tài khoản mẫu

### Admin
- Username: `admin`
- Password: `admin123`

### Sinh viên
- Username: `nguyenvana` | Password: `student123`
- Username: `tranthib` | Password: `student123`
- Username: `lequangc` | Password: `student123`
- Username: `phamminhtd` | Password: `student123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Quizzes
- `GET /api/quizzes` - Lấy danh sách bài kiểm tra
- `GET /api/quizzes/:id` - Lấy chi tiết một bài
- `POST /api/quizzes` - Tạo bài mới (Admin only)
- `PUT /api/quizzes/:id` - Cập nhật bài (Admin only)
- `DELETE /api/quizzes/:id` - Xóa bài (Admin only)

### Submissions
- `POST /api/submissions` - Nộp bài làm
- `GET /api/submissions/user/:userId` - Lịch sử làm bài
- `GET /api/submissions/:id` - Chi tiết một submission

### Leaderboard
- `GET /api/leaderboard` - Bảng xếp hạng tổng
- `GET /api/leaderboard/quiz/:quizId` - Xếp hạng theo bài
- `GET /api/leaderboard/stats` - Thống kê tổng quan

## 🎯 Cấu trúc dự án

```
myapp/
├── backend/
│   ├── models/           # MongoDB models
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   └── Submission.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── quizzes.js
│   │   ├── submissions.js
│   │   └── leaderboard.js
│   ├── middleware/       # Express middleware
│   │   └── auth.js
│   ├── utils/           # Helper functions
│   │   └── helpers.js
│   ├── index.js         # Entry point
│   ├── seedData.js      # Data seeding script
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── api/         # API client
    │   │   └── api.js
    │   ├── components/  # React components
    │   │   ├── Navbar.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/     # React Context
    │   │   └── AuthContext.jsx
    │   ├── pages/       # Page components
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── QuizList.jsx
    │   │   ├── QuizTaking.jsx
    │   │   ├── Result.jsx
    │   │   ├── Leaderboard.jsx
    │   │   └── History.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 📝 Hướng dẫn sử dụng

1. **Đăng nhập**: Sử dụng tài khoản mẫu hoặc đăng ký tài khoản mới
2. **Dashboard**: Xem tổng quan về tiến độ học tập
3. **Bài kiểm tra**: Chọn bài kiểm tra và bắt đầu làm
4. **Làm bài**: Trả lời các câu hỏi trong thời gian quy định
5. **Kết quả**: Xem điểm số và đáp án chi tiết
6. **Xếp hạng**: So sánh điểm với các sinh viên khác

## 🔧 Tùy chỉnh

### Thêm bài kiểm tra mới
Chỉnh sửa file `backend/seedData.js` và thêm quiz vào `multipleChoiceQuizzes` hoặc `practicalQuizzes`

### Thay đổi thời gian làm bài
Cập nhật trường `timeLimit` trong quiz object (đơn vị: phút)

### Thay đổi điểm đạt
Cập nhật trường `passingScore` trong quiz object (đơn vị: %)

## 🐛 Xử lý lỗi thường gặp

### MongoDB connection error
- Kiểm tra MongoDB đã được cài đặt và đang chạy
- Xác nhận MONGODB_URI trong file .env

### Port already in use
- Thay đổi PORT trong .env (backend) hoặc vite.config.js (frontend)

### Dependencies error
- Xóa folder node_modules và package-lock.json
- Chạy lại `npm install`

## 📄 License

MIT License

## 👥 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request.

## 📧 Liên hệ

Nếu có câu hỏi, vui lòng liên hệ qua email hoặc tạo issue trên GitHub.

---

**Phát triển bởi**: Hệ thống Kiểm tra An toàn thông tin
**Năm**: 2024
