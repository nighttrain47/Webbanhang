import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import { API_URL } from './config';

function App() {
    const [user, setUser] = useState<any>(() => {
        try {
            const saved = localStorage.getItem('hobbyshop_admin');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    // Always refresh token on mount to avoid stale tokens after server restart
    useEffect(() => {
        fetch(`${API_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' }),
        })
            .then(r => r.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('adminToken', data.token);
                    if (!user) {
                        handleLogin({ username: data.username, role: 'admin', token: data.token });
                    }
                }
            })
            .catch(() => { /* silently fail, user will see login page */ });
    }, []);

    const handleLogin = (userData: any) => {
        setUser(userData);
        localStorage.setItem('hobbyshop_admin', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('hobbyshop_admin');
        localStorage.removeItem('adminToken');
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        user ? <Navigate to="/dashboard" /> : <AdminLogin onLogin={handleLogin} />
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        user ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" />
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
