import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'components/ui/Button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { user, authReady } = useAuth();

    useEffect(() => {
        // Once auth is ready and we have a user, redirect to admin stock
        if (authReady && user) {
            navigate('/admin/stock');
        }
    }, [authReady, user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const email = username && username.trim();
        const pwd = password && password.trim();

        if (!email || !pwd) {
            setError('Please enter email and password.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, pwd);
            // onAuthStateChanged in AuthContext will redirect when ready
        } catch (err) {
            console.error('Login failed', err);
            // Map common Firebase errors to user-friendly messages
            const code = err && err.code ? err.code : '';
            if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else if (code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Try again later.');
            } else if (code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError(err.message || 'Login failed.');
            }
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
