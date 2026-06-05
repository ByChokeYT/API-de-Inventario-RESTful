import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Verificar si el token viene en la cabecera Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No estás autenticado. Por favor, proporciona un token válido.'
      });
    }
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123_dontshare_change_in_production');
    
    // Buscar si el usuario dueño del token aún existe
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'El usuario asociado a este token ya no existe.'
      });
    }
    
    // Guardar usuario en la solicitud
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Token inválido. Por favor, inicia sesión de nuevo.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'El token ha expirado. Por favor, inicia sesión de nuevo.'
      });
    }
    next(error);
  }
};

// Middleware para restringir acceso según el rol (admin, staff)
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'No tienes permisos para realizar esta acción.'
      });
    }
    next();
  };
};
