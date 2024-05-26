import React, { useState } from 'react';
import { verifyTwoFactor } from '../services/api';

const VerifyTwoFactor = () => {
  const [username, setUsername] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyTwoFactor({ username, twoFactorCode });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Verify Two-Factor Authentication</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>2FA Code:</label>
          <input type="text" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} required />
        </div>
        <button type="submit">Verify</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyTwoFactor;
