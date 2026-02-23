import { Router } from 'express';
import {
  addComment,
  createPost,
  deletePost,
  editPost,
  getFeed,
  searchHashtags,
  toggleLike
} from '../controllers/post.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/feed', authMiddleware, getFeed);
router.get('/search', authMiddleware, searchHashtags);
router.post('/', authMiddleware, upload.array('media', 10), createPost);
router.patch('/:postId', authMiddleware, editPost);
router.delete('/:postId', authMiddleware, deletePost);
router.post('/:postId/like', authMiddleware, toggleLike);
router.post('/:postId/comments', authMiddleware, addComment);

export default router;
