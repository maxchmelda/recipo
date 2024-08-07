const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ ok: false, message: 'No token provided' });
  }

  jwt.verify(token, jwt_secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ ok: false, message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authenticate;
