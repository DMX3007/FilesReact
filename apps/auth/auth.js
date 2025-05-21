const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret-key';

function generateToken(userId) {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: '1h' });
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = { generateToken, authMiddleware };