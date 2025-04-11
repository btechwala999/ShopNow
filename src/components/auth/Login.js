import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../layout/LoadingScreen';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, error, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Form validation
    if (!username.trim()) {
      setFormError('Username is required');
      return;
    }

    if (!password.trim()) {
      setFormError('Password is required');
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>
          
          {(error || formError) && (
            <div className="error-message">
              {formError || error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            
            <div className="form-group">
              <p className="login-info">
                Note: Use <code>johnd</code> as username and <code>m38rmF$</code> as password for testing.
              </p>
            </div>
            
            <button type="submit" className="login-button" disabled={loading}>
              Login
            </button>
            
            <div className="signup-link">
              Don't have an account? <Link to="/signup">Sign up here</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login; 