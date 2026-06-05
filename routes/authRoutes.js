import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: juan_perez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@ejemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secreto123
 *               role:
 *                 type: string
 *                 enum: [admin, staff]
 *                 default: staff
 *                 example: staff
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente. Retorna el token y los datos del usuario.
 *       400:
 *         description: Datos inválidos o usuario/email duplicado.
 */
router.post('/register', register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@ejemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secreto123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Retorna el token JWT.
 *       401:
 *         description: Credenciales incorrectas.
 */
router.post('/login', login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado actualmente
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido con éxito.
 *       401:
 *         description: No autorizado (Token faltante o expirado).
 */
router.get('/me', protect, getMe);

export default router;
