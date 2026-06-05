import { User } from '../models/index.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import jwt from 'jsonwebtoken';

// Función para generar un token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey123_dontshare_change_in_production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Registro de usuarios
export const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Crear el nuevo usuario (Sequelize validará que no estén vacíos ni duplicados)
    const newUser = await User.create({
      username,
      email,
      password,
      role
    });

    // Eliminar contraseña de la respuesta JSON
    newUser.password = undefined;

    // Generar token JWT
    const token = signToken(newUser.id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login de usuarios
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar presencia de credenciales
    if (!email || !password) {
      return next(new AppError('Por favor, proporciona un correo y contraseña.', 400));
    }

    // Buscar el usuario por email
    const user = await User.findOne({ where: { email } });

    // Verificar si el usuario existe y coincide la contraseña
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Correo o contraseña incorrectos.', 401));
    }

    // Generar token JWT
    const token = signToken(user.id);

    // Ocultar contraseña de la respuesta
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener perfil del usuario autenticado actualmente
export const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    user.password = undefined;
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};
