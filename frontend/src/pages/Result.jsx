import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { submissionAPI } from '../api/api';
import './Result.css';

const Result = () => {
    const { id } = useParams();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadResult();
    }, [id]);

    const loadResult = async () => {
        try {
            const response = await submissionAPI.getById(id);
            setSubmission(response.data.data);
        } catch (error) {
            console.error('Load result error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (!submission) return <div className="error">Không tìm thấy kết quả</div>;

    return (
        <div className="result-container">
            <div className="result-header">
                <div className={`result-icon ${submission.passed ? 'passed' : 'failed'}`}>
                    {submission.passed ? '🎉' : '📝'}
                </div>
                <h1>{submission.passed ? 'Chúc mừng! Bạn đã đạt' : 'Chưa đạt yêu cầu'}</h1>
                <p className="quiz-title">{submission.quiz.title}</p>
            </div>

            <div className="result-summary">
                <div className="summary-card">
                    <div className="summary-label">Điểm số</div>
                    <div className="summary-value large">{submission.score}/{submission.totalPoints}</div>
                </div>

                <div className="summary-card">
                    <div className="summary-label">Phần trăm</div>
                    <div className={`summary-value large ${submission.passed ? 'passed' : 'failed'}`}>
                        {submission.percentage.toFixed(1)}%
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-label">Thời gian</div>
                    <div className="summary-value">{Math.floor(submission.timeSpent / 60)} phút</div>
                </div>

                <div className="summary-card">
                    <div className="summary-label">Điểm đạt</div>
                    <div className="summary-value">{submission.quiz.passingScore}%</div>
                </div>
            </div>

            <div className="result-details">
                <h2>Chi tiết từng câu</h2>
                {submission.answers.map((answer, index) => {
                    const question = submission.quiz.questions.find(q => q._id === answer.questionId);
                    if (!question) return null;

                    return (
                        <div key={answer.questionId} className={`answer-card ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                            <div className="answer-header">
                                <h3>Câu {index + 1}</h3>
                                <div className={`result-badge ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                                    {answer.isCorrect ? '✓ Đúng' : '✗ Sai'}
                                    <span className="points">+{answer.pointsEarned}/{question.points} điểm</span>
                                </div>
                            </div>

                            <p className="question-text">{question.questionText}</p>

                            {question.questionType === 'command' ? (
                                <div className="command-answer">
                                    <div className="answer-section">
                                        <strong>Câu trả lời của bạn:</strong>
                                        <pre>{answer.answer || '(Không trả lời)'}</pre>
                                    </div>
                                    {question.expectedOutput && (
                                        <div className="answer-section">
                                            <strong>Đáp án đúng:</strong>
                                            <pre>{question.expectedOutput}</pre>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="choice-answer">
                                    <div className="answer-section">
                                        <strong>Câu trả lời của bạn:</strong>
                                        <p>{Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer || '(Không trả lời)'}</p>
                                    </div>
                                    <div className="answer-section">
                                        <strong>Đáp án đúng:</strong>
                                        <p>{Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}</p>
                                    </div>
                                </div>
                            )}

                            {question.explanation && (
                                <div className="explanation">
                                    <strong>💡 Giải thích:</strong>
                                    <p>{question.explanation}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="result-actions">
                <Link to="/quizzes" className="btn-primary">Làm bài khác</Link>
                <Link to="/leaderboard" className="btn-secondary">Xem xếp hạng</Link>
                <Link to="/history" className="btn-secondary">Lịch sử</Link>
            </div>
        </div>
    );
};

export default Result;
