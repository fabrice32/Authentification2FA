// src/pages/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser, verifyTwoFactor } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });
      if (response.data.twoFactorCode) {
        setShowTwoFactor(true);
        setMessage('Enter the 2FA code sent to your email.');
      } else {
        setMessage('Login successful');
      }
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'An error occurred. Please try again.';
      setMessage(errorMessage);
    }
  };

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyTwoFactor({ username, twoFactorCode });
      setMessage('2FA verification successful');
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Invalid 2FA code';
      setMessage(errorMessage);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {!showTwoFactor ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleTwoFactorSubmit}>
          <div>
            <label>2FA Code:</label>
            <input type="text" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} required />
          </div>
          <button type="submit">Verify</button>
        </form>
      )}
      {message && <p>{message}</p>}
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;
