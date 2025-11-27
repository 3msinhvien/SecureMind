import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        studentId: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);

        const { confirmPassword, ...registerData } = formData;
        const result = await register(registerData);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1>📝 Đăng ký tài khoản</h1>
                <p className="subtitle">Tạo tài khoản để tham gia kiểm tra</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Họ và tên *</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="Nguyễn Văn A"
                            />
                        </div>

                        <div className="form-group">
                            <label>Mã sinh viên</label>
                            <input
                                type="text"
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                placeholder="SV001 (không bắt buộc)"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tên đăng nhập *</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="nguyenvana"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Mật khẩu *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Ít nhất 6 ký tự"
                            />
                        </div>

                        <div className="form-group">
                            <label>Xác nhận mật khẩu *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Nhập lại mật khẩu"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <p className="login-link">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
