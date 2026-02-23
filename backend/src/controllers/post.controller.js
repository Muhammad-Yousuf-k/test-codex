import { StatusCodes } from 'http-status-codes';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { uploadBufferToCloudinary } from '../services/media.service.js';

const parseHashtags = (caption = '') => [...new Set((caption.match(/#\w+/g) || []).map((tag) => tag.toLowerCase()))];

export async function createPost(req, res) {
  const files = req.files || [];
  const media = await Promise.all(
    files.map(async (file) => {
      const mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';
      const uploaded = await uploadBufferToCloudinary(file.buffer, 'instagram-clone/posts', mediaType === 'video' ? 'video' : 'image');
      return { url: uploaded.secure_url, publicId: uploaded.public_id, mediaType };
    })
  );

  const { caption = '', location = '' } = req.body;
  const post = await Post.create({
    author: req.user.userId,
    caption,
    location,
    hashtags: parseHashtags(caption),
    media
  });

  res.status(StatusCodes.CREATED).json(await post.populate('author', 'username profilePicture'));
}

export async function editPost(req, res) {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Post not found' });
  if (post.author.toString() !== req.user.userId) return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' });

  post.caption = req.body.caption ?? post.caption;
  post.location = req.body.location ?? post.location;
  post.hashtags = parseHashtags(post.caption);
  await post.save();
  res.status(StatusCodes.OK).json(post);
}

export async function deletePost(req, res) {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Post not found' });
  if (post.author.toString() !== req.user.userId) return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' });

  await post.deleteOne();
  res.status(StatusCodes.OK).json({ message: 'Post deleted' });
}

export async function toggleLike(req, res) {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Post not found' });

  const exists = post.likes.some((id) => id.toString() === req.user.userId);
  if (exists) post.likes.pull(req.user.userId);
  else {
    post.likes.addToSet(req.user.userId);
    if (post.author.toString() !== req.user.userId) {
      await Notification.create({ recipient: post.author, actor: req.user.userId, type: 'like', post: post._id });
    }
  }
  await post.save();
  res.status(StatusCodes.OK).json({ liked: !exists, totalLikes: post.likes.length });
}

export async function addComment(req, res) {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Post not found' });

  post.comments.push({ user: req.user.userId, text: req.body.text });
  await post.save();
  if (post.author.toString() !== req.user.userId) {
    await Notification.create({ recipient: post.author, actor: req.user.userId, type: 'comment', post: post._id });
  }
  const populated = await post.populate('comments.user', 'username profilePicture');
  res.status(StatusCodes.CREATED).json(populated.comments.at(-1));
}

export async function getFeed(req, res) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const sortBy = req.query.sort === 'trending' ? { 'likes.length': -1, createdAt: -1 } : { createdAt: -1 };

  const me = await User.findById(req.user.userId);
  const authors = [req.user.userId, ...me.following];
  const posts = await Post.find({ author: { $in: authors } })
    .sort(sortBy)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('author', 'username profilePicture')
    .populate('comments.user', 'username profilePicture');

  res.status(StatusCodes.OK).json(posts);
}

export async function searchHashtags(req, res) {
  const tag = (req.query.tag || '').toLowerCase();
  const posts = await Post.find({ hashtags: tag }).populate('author', 'username profilePicture').limit(20);
  res.status(StatusCodes.OK).json(posts);
}
