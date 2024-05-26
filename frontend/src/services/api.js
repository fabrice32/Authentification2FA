import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/users'
});

export const registerUser = async (userData) => {
  return await api.post('/register', userData);
};

export const loginUser = async (userData) => {
  return await api.post('/login', userData);
};

export const verifyTwoFactor = async (userData) => {
  return await api.post('/verify-2fa', userData);
};
