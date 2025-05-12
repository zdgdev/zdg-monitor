import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] grid-pattern flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[var(--color-bg-secondary)] rounded-lg shadow-lg overflow-hidden border border-[var(--color-bg-tertiary)]">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[var(--color-bg-tertiary)] mb-4">
              <Shield size={32} className="text-[var(--color-accent-blue)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] glowing-text">UAV DRONE CONTROL</h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-2">SECURITY CLEARANCE REQUIRED</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-[var(--color-accent-red)]/10 border border-[var(--color-accent-red)]/30 flex items-center">
              <AlertTriangle size={16} className="text-[var(--color-accent-red)] mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-[var(--color-text-secondary)]" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-md bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)] focus:border-[var(--color-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-blue)] text-[var(--color-text-primary)]"
                    placeholder="admin, operator, or viewer"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">Demo users: admin, operator, viewer</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-[var(--color-text-secondary)]" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-md bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)] focus:border-[var(--color-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-blue)] text-[var(--color-text-primary)]"
                    placeholder="password"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">Demo password: password</p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-blue)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-[var(--color-text-secondary)]">
            <span className="mono terminal px-2 py-1">SECURE CONNECTION VERIFIED ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;