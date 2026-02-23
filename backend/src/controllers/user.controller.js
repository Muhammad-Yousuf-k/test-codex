import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { uploadBufferToCloudinary } from '../services/media.service.js';

export async function getProfile(req, res) {
  const user = await User.findById(req.params.userId).select('-password -refreshToken').populate('followers following', 'username profilePicture');
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
  res.status(StatusCodes.OK).json(user);
}

export async function updateProfile(req, res) {
  const updates = { bio: req.body.bio ?? '' };
  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'instagram-clone/profile', 'image');
    updates.profilePicture = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-password -refreshToken');
  res.status(StatusCodes.OK).json(user);
}

export async function followUnfollow(req, res) {
  const me = await User.findById(req.user.userId);
  const target = await User.findById(req.params.userId);
  if (!target) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
  if (me._id.equals(target._id)) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Cannot follow yourself' });

  const isFollowing = me.following.some((id) => id.equals(target._id));
  if (isFollowing) {
    me.following.pull(target._id);
    target.followers.pull(me._id);
  } else {
    me.following.addToSet(target._id);
    target.followers.addToSet(me._id);
    await Notification.create({ recipient: target._id, actor: me._id, type: 'follow' });
  }

  await Promise.all([me.save(), target.save()]);
  res.status(StatusCodes.OK).json({ following: !isFollowing });
}

export async function searchUsers(req, res) {
  const q = req.query.q || '';
  const users = await User.find({ username: { $regex: q, $options: 'i' } }).limit(20).select('username bio profilePicture');
  res.status(StatusCodes.OK).json(users);
}

export async function toggleSavePost(req, res) {
  const user = await User.findById(req.user.userId);
  const postId = req.params.postId;
  const exists = user.savedPosts.some((id) => id.toString() === postId);
  if (exists) user.savedPosts.pull(postId);
  else user.savedPosts.addToSet(postId);
  await user.save();
  res.status(StatusCodes.OK).json({ saved: !exists });
}
