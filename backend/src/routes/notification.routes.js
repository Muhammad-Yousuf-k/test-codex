import { Router } from 'express';
import { getNotifications, markRead } from '../controllers/notification.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', authMiddleware, getNotifications);
router.patch('/:id/read', authMiddleware, markRead);

export default router;
