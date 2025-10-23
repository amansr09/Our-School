import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, initAdmin } from '../../utils/api';
import { toast } from 'react-toastify';
import './AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(credentials);
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInitAdmin = async () => {
    try {
      await initAdmin();
      toast.success('Admin initialized! You can now login with credentials from .env file');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Initialization failed');
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-card">
          <h1>Admin Login</h1>
          <p className="login-subtitle">School Website Management</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="admin@school.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-help">
            <p>First time setup?</p>
            <button onClick={handleInitAdmin} className="btn btn-secondary btn-sm">
              Initialize Admin Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
