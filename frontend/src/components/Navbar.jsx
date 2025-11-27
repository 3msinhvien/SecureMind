import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    🔒 CyberSec Quiz
                </Link>

                {isAuthenticated && (
                    <div className="nav-menu">
                        <Link to="/" className="nav-link">Dashboard</Link>
                        <Link to="/quizzes" className="nav-link">Bài kiểm tra</Link>
                        <Link to="/leaderboard" className="nav-link">Xếp hạng</Link>
                        <Link to="/history" className="nav-link">Lịch sử</Link>

                        <div className="nav-user">
                            <span className="user-name">👤 {user?.fullName}</span>
                            <span className="user-score">⭐ {user?.totalScore} điểm</span>
                            <button onClick={handleLogout} className="btn-logout">
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
