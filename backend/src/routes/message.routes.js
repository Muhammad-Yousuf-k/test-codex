import { Router } from 'express';
import { getConversation, sendMessage } from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();
router.get('/:userId', authMiddleware, getConversation);
router.post('/:userId', authMiddleware, upload.single('media'), sendMessage);

export default router;
