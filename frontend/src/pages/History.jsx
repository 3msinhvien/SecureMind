import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { submissionAPI } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import './History.css';

const History = () => {
    const { user } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: 'all',
        status: 'all',
        sort: 'newest'
    });
    const [stats, setStats] = useState({
        total: 0,
        passed: 0,
        failed: 0,
        avgScore: 0
    });

    useEffect(() => {
        if (user) {
            loadHistory();
        }
    }, [user]);

    useEffect(() => {
        applyFilters();
    }, [submissions, filters]);

    const loadHistory = async () => {
        const userId = user?.id || user?._id;
        if (!userId) {
            console.log('User not loaded yet:', user);
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            console.log('Loading history for user:', userId);
            const response = await submissionAPI.getUserSubmissions(userId);
            console.log('Submissions response:', response.data);
            setSubmissions(response.data.data || []);
            calculateStats(response.data.data || []);
        } catch (error) {
            console.error('Load history error:', error);
            console.error('Error details:', error.response?.data);
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const total = data.length;
        const passed = data.filter(s => s.passed).length;
        const failed = total - passed;
        const avgScore = total > 0 ? data.reduce((sum, s) => sum + s.percentage, 0) / total : 0;
        
        setStats({ total, passed, failed, avgScore: avgScore.toFixed(1) });
    };

    const applyFilters = () => {
        let filtered = [...submissions];

        // Lọc theo loại
        if (filters.type !== 'all') {
            filtered = filtered.filter(s => s.quiz.type === filters.type);
        }

        // Lọc theo trạng thái
        if (filters.status === 'passed') {
            filtered = filtered.filter(s => s.passed);
        } else if (filters.status === 'failed') {
            filtered = filtered.filter(s => !s.passed);
        }

        // Sắp xếp
        if (filters.sort === 'newest') {
            filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        } else if (filters.sort === 'oldest') {
            filtered.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
        } else if (filters.sort === 'highest') {
            filtered.sort((a, b) => b.score - a.score);
        } else if (filters.sort === 'lowest') {
            filtered.sort((a, b) => a.score - b.score);
        }

        setFilteredSubmissions(filtered);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="history-container">
            <div className="history-header">
                <h1>📊 Lịch sử làm bài</h1>
                <p>Xem lại tất cả bài kiểm tra đã hoàn thành</p>
                {submissions.length > 0 && (
                    <button onClick={loadHistory} className="btn-refresh" disabled={loading}>
                        🔄 {loading ? 'Đang tải...' : 'Tải lại'}
                    </button>
                )}
            </div>

            {submissions.length === 0 ? (
                <div className="empty-state">
                    <p>Bạn chưa hoàn thành bài kiểm tra nào</p>
                    <Link to="/quizzes" className="btn-primary">Bắt đầu làm bài</Link>
                </div>
            ) : (
                <>
                    {/* Statistics Cards */}
                    <div className="history-stats">
                        <div className="stat-card">
                            <div className="stat-icon">📝</div>
                            <div className="stat-info">
                                <div className="stat-value">{stats.total}</div>
                                <div className="stat-label">Tổng bài làm</div>
                            </div>
                        </div>
                        <div className="stat-card success">
                            <div className="stat-icon">✅</div>
                            <div className="stat-info">
                                <div className="stat-value">{stats.passed}</div>
                                <div className="stat-label">Đạt yêu cầu</div>
                            </div>
                        </div>
                        <div className="stat-card danger">
                            <div className="stat-icon">❌</div>
                            <div className="stat-info">
                                <div className="stat-value">{stats.failed}</div>
                                <div className="stat-label">Chưa đạt</div>
                            </div>
                        </div>
                        <div className="stat-card primary">
                            <div className="stat-icon">📊</div>
                            <div className="stat-info">
                                <div className="stat-value">{stats.avgScore}%</div>
                                <div className="stat-label">Điểm trung bình</div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="history-filters">
                        <div className="filter-group">
                            <label>Loại bài:</label>
                            <select 
                                value={filters.type} 
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                            >
                                <option value="all">Tất cả</option>
                                <option value="multiple-choice">Trắc nghiệm</option>
                                <option value="practical">Thực hành</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Trạng thái:</label>
                            <select 
                                value={filters.status} 
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="all">Tất cả</option>
                                <option value="passed">Đạt yêu cầu</option>
                                <option value="failed">Chưa đạt</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Sắp xếp:</label>
                            <select 
                                value={filters.sort} 
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="highest">Điểm cao nhất</option>
                                <option value="lowest">Điểm thấp nhất</option>
                            </select>
                        </div>

                        <div className="filter-result">
                            Hiển thị {filteredSubmissions.length} / {submissions.length} bài làm
                        </div>
                    </div>

                    {/* Submissions Table */}
                    {filteredSubmissions.length === 0 ? (
                        <div className="empty-state">
                            <p>Không tìm thấy bài làm phù hợp với bộ lọc</p>
                        </div>
                    ) : (
                        <div className="submissions-table">
                            {filteredSubmissions.map((submission) => (
                                <Link to={`/result/${submission._id}`} key={submission._id} className="submission-row">
                                    <div className="submission-quiz">
                                        <h3>{submission.quiz.title}</h3>
                                        <p className="quiz-info">
                                            {submission.quiz.type === 'multiple-choice' ? '📝 Trắc nghiệm' : '💻 Thực hành'} •
                                            {submission.quiz.difficulty === 'easy' ? ' Dễ' : submission.quiz.difficulty === 'medium' ? ' Trung bình' : ' Khó'}
                                            {submission.quiz.category && ` • ${submission.quiz.category}`}
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
                                        <div className="date">📅 {formatDate(submission.submittedAt)}</div>
                                        <div className="time-spent">⏱️ {Math.floor(submission.timeSpent / 60)} phút {submission.timeSpent % 60} giây</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default History;
