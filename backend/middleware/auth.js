const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Accept token from Authorization: Bearer <token> or x-auth-token
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // we store id when signing
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
