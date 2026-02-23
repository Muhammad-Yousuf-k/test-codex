import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../utils/tokens.js';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
  }
}
