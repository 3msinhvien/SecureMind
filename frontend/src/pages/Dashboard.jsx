import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { quizAPI, submissionAPI, leaderboardAPI } from '../api/api';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalQuizzes: 0,
        completedQuizzes: 0,
        recentSubmissions: [],
        topPerformers: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, [user]);

    const loadDashboard = async () => {
        try {
            const [quizzesRes, submissionsRes, leaderboardRes] = await Promise.all([
                quizAPI.getAll(),
                submissionAPI.getUserSubmissions(user.id),
                leaderboardAPI.getGlobal(5)
            ]);

            setStats({
                totalQuizzes: quizzesRes.data.count,
                completedQuizzes: submissionsRes.data.count,
                recentSubmissions: submissionsRes.data.data.slice(0, 5),
                topPerformers: leaderboardRes.data.data
            });
        } catch (error) {
            console.error('Load dashboard error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Xin chào, {user?.fullName}! 👋</h1>
                <p>Chào mừng bạn đến với hệ thống kiểm tra An toàn thông tin</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <h3>{stats.totalQuizzes}</h3>
                        <p>Tổng số bài kiểm tra</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3>{stats.completedQuizzes}</h3>
                        <p>Bài đã hoàn thành</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                        <h3>{user?.totalScore || 0}</h3>
                        <p>Tổng điểm</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                        <h3>{stats.totalQuizzes - stats.completedQuizzes}</h3>
                        <p>Còn lại</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="section">
                    <div className="section-header">
                        <h2>Lịch sử làm bài gần đây</h2>
                        <Link to="/history" className="view-all">Xem tất cả →</Link>
                    </div>

                    {stats.recentSubmissions.length === 0 ? (
                        <div className="empty-state">
                            <p>Bạn chưa làm bài kiểm tra nào</p>
                            <Link to="/quizzes" className="btn-primary">Bắt đầu làm bài</Link>
                        </div>
                    ) : (
                        <div className="submissions-list">
                            {stats.recentSubmissions.map((submission) => (
                                <div key={submission._id} className="submission-item">
                                    <div className="submission-info">
                                        <h4>{submission.quiz.title}</h4>
                                        <p className="quiz-meta">
                                            {submission.quiz.type === 'multiple-choice' ? '📝 Trắc nghiệm' : '💻 Thực hành'} •
                                            {submission.quiz.difficulty === 'easy' ? ' Dễ' : submission.quiz.difficulty === 'medium' ? ' Trung bình' : ' Khó'}
                                        </p>
                                    </div>
                                    <div className="submission-result">
                                        <div className={`score ${submission.passed ? 'passed' : 'failed'}`}>
                                            {submission.score}/{submission.totalPoints}
                                        </div>
                                        <div className="percentage">{submission.percentage.toFixed(1)}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="section">
                    <div className="section-header">
                        <h2>🏆 Top 5 xếp hạng</h2>
                        <Link to="/leaderboard" className="view-all">Xem tất cả →</Link>
                    </div>

                    <div className="leaderboard-mini">
                        {stats.topPerformers.map((performer, index) => (
                            <div key={index} className="leaderboard-item">
                                <div className="rank">#{performer.rank}</div>
                                <div className="performer-info">
                                    <div className="name">{performer.fullName}</div>
                                    <div className="meta">{performer.completedQuizzes} bài</div>
                                </div>
                                <div className="score">{performer.totalScore} điểm</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <Link to="/quizzes" className="action-card">
                    <div className="action-icon">📝</div>
                    <h3>Làm bài kiểm tra</h3>
                    <p>Chọn bài kiểm tra để bắt đầu</p>
                </Link>

                <Link to="/leaderboard" className="action-card">
                    <div className="action-icon">🏆</div>
                    <h3>Xem xếp hạng</h3>
                    <p>So sánh với các bạn khác</p>
                </Link>

                <Link to="/history" className="action-card">
                    <div className="action-icon">📊</div>
                    <h3>Lịch sử làm bài</h3>
                    <p>Xem lại kết quả của bạn</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
