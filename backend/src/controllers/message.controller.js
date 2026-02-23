import { StatusCodes } from 'http-status-codes';
import Message from '../models/Message.js';
import { uploadBufferToCloudinary } from '../services/media.service.js';

const buildChatId = (a, b) => [a.toString(), b.toString()].sort().join('_');

export async function getConversation(req, res) {
  const chatId = buildChatId(req.user.userId, req.params.userId);
  const messages = await Message.find({ chatId }).sort({ createdAt: 1 }).populate('sender receiver', 'username profilePicture');
  res.status(StatusCodes.OK).json(messages);
}

export async function sendMessage(req, res) {
  const receiver = req.params.userId;
  const chatId = buildChatId(req.user.userId, receiver);
  let media = { url: '', publicId: '', mediaType: '' };
  if (req.file) {
    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'instagram-clone/messages', mediaType === 'video' ? 'video' : 'image');
    media = { url: uploaded.secure_url, publicId: uploaded.public_id, mediaType };
  }

  const message = await Message.create({
    chatId,
    sender: req.user.userId,
    receiver,
    text: req.body.text || '',
    media
  });

  res.status(StatusCodes.CREATED).json(await message.populate('sender receiver', 'username profilePicture'));
}
