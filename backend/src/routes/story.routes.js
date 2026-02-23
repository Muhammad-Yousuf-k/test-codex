import { Router } from 'express';
import { createStory, getStories } from '../controllers/story.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();
router.get('/', authMiddleware, getStories);
router.post('/', authMiddleware, upload.single('media'), createStory);

export default router;
