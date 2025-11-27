import { useState, useEffect } from 'react';
import { leaderboardAPI } from '../api/api';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const response = await leaderboardAPI.getGlobal(50);
            setLeaderboard(response.data.data);
        } catch (error) {
            console.error('Load leaderboard error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMedalEmoji = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h1>🏆 Bảng xếp hạng</h1>
                <p>Top sinh viên xuất sắc nhất</p>
            </div>

            <div className="leaderboard-table">
                {leaderboard.map((entry) => (
                    <div key={entry.rank} className={`leaderboard-row ${entry.rank <= 3 ? 'top-three' : ''}`}>
                        <div className="rank-badge">
                            {getMedalEmoji(entry.rank)}
                        </div>
                        <div className="user-info">
                            <div className="user-name">{entry.fullName}</div>
                            <div className="user-meta">
                                @{entry.username} {entry.studentId && `• ${entry.studentId}`}
                            </div>
                        </div>
                        <div className="user-stats">
                            <div className="stat">
                                <span className="stat-value">{entry.totalScore}</span>
                                <span className="stat-label">điểm</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{entry.completedQuizzes}</span>
                                <span className="stat-label">bài</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
