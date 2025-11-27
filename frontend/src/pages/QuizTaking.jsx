import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, submissionAPI } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import './QuizTaking.css';

const QuizTaking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loadUser } = useContext(AuthContext);
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [startTime] = useState(new Date());
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuiz();
    }, [id]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const loadQuiz = async () => {
        try {
            const response = await quizAPI.getById(id);
            setQuiz(response.data.data);
            setTimeLeft(response.data.data.timeLimit * 60);
        } catch (error) {
            console.error('Load quiz error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSubmit = async () => {
        const timeSpent = Math.floor((new Date() - startTime) / 1000);
        const submissionData = {
            quizId: id,
            answers: Object.keys(answers).map(qId => ({
                questionId: qId,
                answer: answers[qId]
            })),
            timeSpent,
            startedAt: startTime
        };

        try {
            const response = await submissionAPI.submit(submissionData);
            // Reload user để cập nhật điểm
            await loadUser();
            navigate(`/result/${response.data.data._id}`);
        } catch (error) {
            console.error('Submit error:', error);
            alert('Có lỗi xảy ra khi nộp bài');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (!quiz) return <div className="error">Không tìm thấy bài kiểm tra</div>;

    return (
        <div className="quiz-taking">
            <div className="quiz-header-bar">
                <h2>{quiz.title}</h2>
                <div className="timer">⏱️ {formatTime(timeLeft)}</div>
            </div>

            <div className="quiz-content">
                {quiz.questions.map((question, index) => (
                    <div key={question._id} className="question-card">
                        <h3>Câu {index + 1}: {question.questionText}</h3>

                        {question.questionType === 'command' ? (
                            <div className="command-input">
                                {question.commandHint && <p className="hint">💡 {question.commandHint}</p>}
                                <textarea
                                    placeholder="Nhập lệnh của bạn..."
                                    value={answers[question._id] || ''}
                                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                    rows={4}
                                />
                            </div>
                        ) : (
                            <div className="options">
                                {question.options.map((option, optIndex) => (
                                    <label key={optIndex} className="option">
                                        <input
                                            type={question.questionType === 'multiple-choice' ? 'checkbox' : 'radio'}
                                            name={question._id}
                                            value={option}
                                            checked={
                                                question.questionType === 'multiple-choice'
                                                    ? (answers[question._id] || []).includes(option)
                                                    : answers[question._id] === option
                                            }
                                            onChange={(e) => {
                                                if (question.questionType === 'multiple-choice') {
                                                    const current = answers[question._id] || [];
                                                    const updated = e.target.checked
                                                        ? [...current, option]
                                                        : current.filter(o => o !== option);
                                                    handleAnswerChange(question._id, updated);
                                                } else {
                                                    handleAnswerChange(question._id, option);
                                                }
                                            }}
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <button onClick={handleSubmit} className="btn-submit">
                    Nộp bài
                </button>
            </div>
        </div>
    );
};

export default QuizTaking;
