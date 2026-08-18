import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Zap, Lock, User as UserIcon, Mail, AlertCircle, Loader2 } from 'lucide-react';

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, quickDemoLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password, email);
      }
    } catch (err) {
      const respData = err.response?.data;
      if (respData) {
        if (respData.detail) {
          setError(respData.detail);
        } else if (respData.username) {
          setError(respData.username[0]);
        } else if (respData.password) {
          setError(respData.password[0]);
        } else {
          setError('Authentication failed. Please check your credentials.');
        }
      } else {
        setError('Cannot connect to backend server. Is Django running?');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async () => {
    setError('');
    try {
      setLoading(true);
      await quickDemoLogin();
    } catch (err) {
      setError('Failed to log in with demo account. Ensure Django is running and seeded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge-icon">
            <Lock size={24} />
          </div>
          <h1 className="auth-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="auth-subtitle">
            {isLogin
              ? 'Sign in to access your personal minimalist task board'
              : 'Start organizing your tasks with private cloud sync'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            <UserPlus size={16} />
            <span>Register</span>
          </button>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="auth-username">Username</label>
            <div className="input-with-icon">
              <UserIcon size={18} className="field-icon" />
              <input
                id="auth-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-field">
              <label htmlFor="auth-email">Email (Optional)</label>
              <div className="input-with-icon">
                <Mail size={18} className="field-icon" />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
            </div>
          )}

          <div className="form-field">
            <label htmlFor="auth-password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            id="auth-submit-btn"
          >
            {loading ? (
              <Loader2 className="spinner" size={18} />
            ) : isLogin ? (
              <LogIn size={18} />
            ) : (
              <UserPlus size={18} />
            )}
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="demo-account-btn"
          onClick={handleDemoClick}
          disabled={loading}
          id="demo-login-btn"
        >
          <Zap size={18} className="zap-icon" />
          <span>One-Click Demo Login</span>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
