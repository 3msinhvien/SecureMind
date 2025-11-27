import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../api/api';
import './QuizList.css';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [filter, setFilter] = useState({ type: '', difficulty: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuizzes();
    }, [filter]);

    const loadQuizzes = async () => {
        try {
            const response = await quizAPI.getAll(filter);
            setQuizzes(response.data.data);
        } catch (error) {
            console.error('Load quizzes error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyBadge = (difficulty) => {
        const badges = {
            easy: { text: 'Dễ', class: 'badge-easy' },
            medium: { text: 'Trung bình', class: 'badge-medium' },
            hard: { text: 'Khó', class: 'badge-hard' }
        };
        return badges[difficulty] || badges.medium;
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="quiz-list-container">
            <div className="quiz-list-header">
                <h1>📚 Danh sách bài kiểm tra</h1>
                <p>Chọn bài kiểm tra để bắt đầu</p>
            </div>

            <div className="filters">
                <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                    <option value="">Tất cả loại</option>
                    <option value="multiple-choice">Trắc nghiệm</option>
                    <option value="practical">Thực hành</option>
                </select>

                <select value={filter.difficulty} onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}>
                    <option value="">Tất cả độ khó</option>
                    <option value="easy">Dễ</option>
                    <option value="medium">Trung bình</option>
                    <option value="hard">Khó</option>
                </select>
            </div>

            <div className="quiz-grid">
                {quizzes.map((quiz) => {
                    const badge = getDifficultyBadge(quiz.difficulty);
                    return (
                        <Link to={`/quiz/${quiz._id}`} key={quiz._id} className="quiz-card">
                            <div className="quiz-header">
                                <span className="quiz-type">
                                    {quiz.type === 'multiple-choice' ? '📝 Trắc nghiệm' : '💻 Thực hành'}
                                </span>
                                <span className={`badge ${badge.class}`}>{badge.text}</span>
                            </div>

                            <h3>{quiz.title}</h3>
                            <p className="quiz-description">{quiz.description}</p>

                            <div className="quiz-meta">
                                <span>⏱️ {quiz.timeLimit} phút</span>
                                <span>📊 {quiz.questions.length} câu</span>
                                <span>⭐ {quiz.totalPoints} điểm</span>
                            </div>

                            <div className="quiz-footer">
                                <span className="passing-score">Điểm đạt: {quiz.passingScore}%</span>
                                <button className="btn-start">Bắt đầu →</button>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {quizzes.length === 0 && (
                <div className="empty-state">
                    <p>Không tìm thấy bài kiểm tra nào</p>
                </div>
            )}
        </div>
    );
};

export default QuizList;
