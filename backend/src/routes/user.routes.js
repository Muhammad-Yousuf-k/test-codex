import { Router } from 'express';
import { followUnfollow, getProfile, searchUsers, toggleSavePost, updateProfile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/search', authMiddleware, searchUsers);
router.get('/:userId', authMiddleware, getProfile);
router.patch('/me', authMiddleware, upload.single('profilePicture'), updateProfile);
router.post('/:userId/follow', authMiddleware, followUnfollow);
router.post('/saved/:postId', authMiddleware, toggleSavePost);

export default router;
