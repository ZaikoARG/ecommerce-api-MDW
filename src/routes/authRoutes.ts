import {Router} from "express";
import {register, login, logout, refresh} from "../controllers/authController";

const router = Router(); // Crea un mini-router para auth

router.post('/register', register);  // POST /api/auth/register
router.post('/login', login);        // POST /api/auth/login
router.post('/logout', logout);      // POST /api/auth/logout
router.post('/refresh', refresh);    // POST /api/auth/refresh

export default router;