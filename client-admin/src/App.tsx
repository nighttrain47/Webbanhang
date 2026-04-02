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

    // Verify stored token is still valid on mount
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token || !user) return;

        fetch(`${API_URL}/api/admin/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(r => {
                if (!r.ok) {
                    // Token expired or invalid — force re-login
                    handleLogout();
                }
            })
            .catch(() => {
                // Server unreachable — keep user logged in with cached state
            });
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
