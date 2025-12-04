import {Router} from "express";
import {register, login, logout, refresh, getMe} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router(); // Crea un mini-router para auth

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operaciones de autenticación de usuarios
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario en el sistema
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email único del usuario
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Contraseña (mínimo 6 caracteres)
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos o email ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Datos invalidos. La longitud minima de la conteaseña es de 6 caracteres.
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error del servidor
 */
router.post('/register', register);  // POST /api/auth/register

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión y genera tokens JWT en cookies
 *     tags: [Auth]
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
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso (tokens en cookies)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login Existoso !
 *         headers:
 *           Set-Cookie:
 *             description: accessToken (expira en 15m) y refreshToken (expira en 7d), HTTP-only
 *             schema:
 *               type: string
 *       400:
 *         description: Datos inválidos o credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Credenciales Invalidas.
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error del servidor
 */
router.post('/login', login);        // POST /api/auth/login

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierra sesión y limpia cookies de tokens
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso (cookies limpias)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout Exitoso
 *       401:
 *         description: Acceso denegado (sin token válido)
 */
router.post('/logout', logout);      // POST /api/auth/logout

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresca el accessToken usando refreshToken
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token refrescado (nuevo accessToken en cookie)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token refrescado !
 *         headers:
 *           Set-Cookie:
 *             description: Nuevo accessToken (expira en 15m)
 *             schema:
 *               type: string
 *       401:
 *         description: No hay refreshToken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No hay refresh token.
 *       403:
 *         description: RefreshToken inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token invalido
 *       500:
 *         description: Error del servidor (implícito)
 */
router.post('/refresh', refresh);    // POST /api/auth/refresh

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtiene la información del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 6798c1df82f38439c903c132
 *                     email:
 *                       type: string
 *                       example: juan@example.com
 *                     name:
 *                       type: string
 *                       example: Juan Pérez
 *       401:
 *         description: No autenticado (cookie faltante o inválida)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No estás autenticado
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error obteniendo usuario
 */
router.get('/me', authMiddleware, getMe);   // GET /api/auth/me

export default router;