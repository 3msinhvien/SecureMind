import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { submissionAPI } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import './History.css';

const History = () => {
    const { user } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, [user]);

    const loadHistory = async () => {
        try {
            const response = await submissionAPI.getUserSubmissions(user.id);
            setSubmissions(response.data.data);
        } catch (error) {
            console.error('Load history error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('vi-VN');
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="history-container">
            <div className="history-header">
                <h1>📊 Lịch sử làm bài</h1>
                <p>Xem lại tất cả bài kiểm tra đã hoàn thành</p>
            </div>

            {submissions.length === 0 ? (
                <div className="empty-state">
                    <p>Bạn chưa hoàn thành bài kiểm tra nào</p>
                    <Link to="/quizzes" className="btn-primary">Bắt đầu làm bài</Link>
                </div>
            ) : (
                <div className="submissions-table">
                    {submissions.map((submission) => (
                        <Link to={`/result/${submission._id}`} key={submission._id} className="submission-row">
                            <div className="submission-quiz">
                                <h3>{submission.quiz.title}</h3>
                                <p className="quiz-info">
                                    {submission.quiz.type === 'multiple-choice' ? '📝 Trắc nghiệm' : '💻 Thực hành'} •
                                    {submission.quiz.difficulty === 'easy' ? ' Dễ' : submission.quiz.difficulty === 'medium' ? ' Trung bình' : ' Khó'}
                                </p>
                            </div>

                            <div className="submission-result">
                                <div className={`score-badge ${submission.passed ? 'passed' : 'failed'}`}>
                                    {submission.passed ? '✓ Đạt' : '✗ Chưa đạt'}
                                </div>
                                <div className="score-details">
                                    <div className="score">{submission.score}/{submission.totalPoints}</div>
                                    <div className="percentage">{submission.percentage.toFixed(1)}%</div>
                                </div>
                            </div>

                            <div className="submission-meta">
                                <div className="date">{formatDate(submission.submittedAt)}</div>
                                <div className="time-spent">⏱️ {Math.floor(submission.timeSpent / 60)} phút</div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
