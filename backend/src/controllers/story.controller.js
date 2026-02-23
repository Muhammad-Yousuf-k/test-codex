import { StatusCodes } from 'http-status-codes';
import Story from '../models/Story.js';
import { uploadBufferToCloudinary } from '../services/media.service.js';

export async function createStory(req, res) {
  if (!req.file) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Story media required' });
  const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
  const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'instagram-clone/stories', mediaType === 'video' ? 'video' : 'image');

  const story = await Story.create({
    user: req.user.userId,
    media: { url: uploaded.secure_url, publicId: uploaded.public_id, mediaType }
  });

  res.status(StatusCodes.CREATED).json(await story.populate('user', 'username profilePicture'));
}

export async function getStories(req, res) {
  const stories = await Story.find({ expiresAt: { $gt: new Date() } }).populate('user', 'username profilePicture').sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json(stories);
}
