const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'GymControl2024SecretKey';

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

function roleMiddleware(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'Acceso denegado: rol no autorizado' });
    }
    next();
  };
}

module.exports = { authMiddleware, roleMiddleware };
