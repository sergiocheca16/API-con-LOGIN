const jwt = require('jsonwebtoken');
const hashedSecret = require('../crypto/config');

// Middleware para verificar el token JWT
/*function verifyToken(req, res, next) {
  const token = req.session.token;

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado.' });
  }

  jwt.verify(token, hashedSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    req.user = decoded;
    next();
  });
}*/

function verifyToken(req, res, next) {
  const token = req.session.token;

  if (!token) {
    res.status(401).json({ Mensaje: 'Token no existe' });
  }
  jwt.verify(token, hashedSecret, (err, decoded) => {
    if (err) {
      res.status(401).json({ Mensaje: 'Token invalido' });
    }
    req.user = decoded.user;
    next();
  });
}



// Generar token JWT
function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, hashedSecret, {
    expiresIn: '1h',
  });
}

module.exports = { verifyToken, generateToken };
