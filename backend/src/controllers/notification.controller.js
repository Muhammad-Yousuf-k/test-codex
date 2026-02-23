import { StatusCodes } from 'http-status-codes';
import Notification from '../models/Notification.js';

export async function getNotifications(req, res) {
  const notifications = await Notification.find({ recipient: req.user.userId })
    .sort({ createdAt: -1 })
    .populate('actor', 'username profilePicture')
    .populate('post', 'media caption');
  res.status(StatusCodes.OK).json(notifications);
}

export async function markRead(req, res) {
  await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user.userId }, { read: true });
  res.status(StatusCodes.OK).json({ message: 'Marked read' });
}
