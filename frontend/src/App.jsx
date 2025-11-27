import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizList from './pages/QuizList';
import QuizTaking from './pages/QuizTaking';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import History from './pages/History';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            <Route path="/quizzes" element={
              <PrivateRoute>
                <QuizList />
              </PrivateRoute>
            } />

            <Route path="/quiz/:id" element={
              <PrivateRoute>
                <QuizTaking />
              </PrivateRoute>
            } />

            <Route path="/result/:id" element={
              <PrivateRoute>
                <Result />
              </PrivateRoute>
            } />

            <Route path="/leaderboard" element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            } />

            <Route path="/history" element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
