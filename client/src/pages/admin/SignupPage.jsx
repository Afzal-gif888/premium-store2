import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'components/ui/Button';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    const em = email && email.trim();
    const pw = password && password.trim();

    if (!em || !pw) {
      setError('Email and password are required.');
      return;
    }
    if (pw.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, em, pw);
      // Signup succeeded; user will be signed in. Redirect to admin area.
      navigate('/admin/stock');
    } catch (err) {
      console.error('Signup failed', err);
      const code = err && err.code ? err.code : '';
      if (code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(err.message || 'Signup failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Admin Account</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <Button type="submit" className="w-full justify-center" loading={loading}>
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
