import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from 'store/slices/authSlice';
import Button from 'components/ui/Button';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authState = useSelector(state => state.auth) || { isAuthenticated: false };
    const { isAuthenticated } = authState;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin/stock'); // Default to stock page
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        // Dispatch login action
        // logic inside slice handles validation, but we can also check here if we want immediate feedback
        // but the slice is the 'backend' logic.

        if (username === 'chandpeera786@gmail.com' && password === 'peera143@') {
            dispatch(login({ username, password }));
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Access</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full justify-center">
                        Login
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Button variant="ghost" onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
                        ← Back to Store
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
