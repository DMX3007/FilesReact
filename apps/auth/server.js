const express = require('express');
const router = express.Router();
const { generateToken, authMiddleware } = require('./auth');

// Mock user store
const users = [
  { id: 1, username: 'admin', password: 'admin' },
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken(user.id);
  res.json({ token });
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);
  const token = generateToken(newUser.id);
  res.status(201).json({ token });
});

module.exports = router;
