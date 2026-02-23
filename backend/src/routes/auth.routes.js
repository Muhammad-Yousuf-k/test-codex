import { Router } from 'express';
import { login, logout, refresh, signup } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', authMiddleware, logout);

export default router;
