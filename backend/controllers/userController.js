const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a 2FA code
    if (user.isTwoFactorEnabled) {
      const twoFactorCode = crypto.randomBytes(3).toString('hex');
      user.twoFactorCode = twoFactorCode;
      await user.save();
      // In a real app, you'd send the code via SMS or email
      res.status(200).json({ message: '2FA code sent', twoFactorCode });
    } else {
      res.status(200).json({ message: 'Login successful', user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyTwoFactor = async (req, res) => {
  const { username, twoFactorCode } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || user.twoFactorCode !== twoFactorCode) {
      return res.status(401).json({ message: 'Invalid 2FA code' });
    }
    user.twoFactorCode = null; // Clear the 2FA code
    await user.save();
    res.status(200).json({ message: '2FA verification successful', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
