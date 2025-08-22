import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://lead-gen-ai-backend-595294038624.asia-south2.run.app/api/v1';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const existing = (() => {
    try {
      const raw = localStorage.getItem('auth');
      if (!raw) return null;
      const { access_token } = JSON.parse(raw);
      return access_token ? true : false;
    } catch {
      return false;
    }
  })();

  if (existing) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      localStorage.setItem('auth', JSON.stringify(data));
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign in</h1>
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 pr-20 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4 text-center">Don't have an account? Ask admin to register you.</p>
      </div>
    </div>
  );
};

export default LoginPage;


