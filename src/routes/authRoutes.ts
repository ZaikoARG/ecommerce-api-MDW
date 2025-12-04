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
 *     summary: Inicia sesión, genera tokens JWT y los envía en cookies HTTP-only
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
 *         description: Login exitoso. Las cookies accessToken y refreshToken se envían automáticamente.
 *         headers:
 *           Set-Cookie:
 *             description: >
 *               Envía las cookies:
 *                 - accessToken (HTTP-only, expira en 15m)
 *                 - refreshToken (HTTP-only, expira en 7 días)
 *               Ambas con SameSite=None y secure=true en producción.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login exitoso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                   example:
 *                     id: "65b1c97f2fcf0b1234abcd89"
 *                     name: "Juan Pérez"
 *                     email: "juan@example.com"
 *       400:
 *         description: Datos inválidos o credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Credenciales inválidas.
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
 *     summary: Obtiene el usuario autenticado usando las cookies HTTP-only
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado retornado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado o token inválido
 */
router.get("/me", authMiddleware, getMe);

export default router;