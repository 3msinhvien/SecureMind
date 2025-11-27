import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Tạo axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor để tự động thêm token vào mọi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me')
};

// Quiz API
export const quizAPI = {
    getAll: (params) => api.get('/quizzes', { params }),
    getById: (id) => api.get(`/quizzes/${id}`),
    create: (data) => api.post('/quizzes', data),
    update: (id, data) => api.put(`/quizzes/${id}`, data),
    delete: (id) => api.delete(`/quizzes/${id}`)
};

// Submission API
export const submissionAPI = {
    submit: (data) => api.post('/submissions', data),
    getUserSubmissions: (userId) => api.get(`/submissions/user/${userId}`),
    getQuizSubmissions: (quizId) => api.get(`/submissions/quiz/${quizId}`),
    getById: (id) => api.get(`/submissions/${id}`)
};

// Leaderboard API
export const leaderboardAPI = {
    getGlobal: (limit) => api.get('/leaderboard', { params: { limit } }),
    getByQuiz: (quizId, limit) => api.get(`/leaderboard/quiz/${quizId}`, { params: { limit } }),
    getStats: () => api.get('/leaderboard/stats')
};

export default api;
