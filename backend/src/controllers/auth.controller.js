import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';

function buildAuthResponse(user) {
  const payload = { userId: user._id, username: user.username };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture
    }
  };
}

export async function signup(req, res) {
  const { username, email, password } = req.body;
  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) return res.status(StatusCodes.CONFLICT).json({ message: 'User already exists' });

  const user = await User.create({ username, email, password });
  const auth = buildAuthResponse(user);
  user.refreshToken = auth.refreshToken;
  await user.save();
  res.status(StatusCodes.CREATED).json(auth);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  }

  const auth = buildAuthResponse(user);
  user.refreshToken = auth.refreshToken;
  await user.save();
  res.status(StatusCodes.OK).json(auth);
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.userId);
  if (!user || user.refreshToken !== refreshToken) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
  }

  const auth = buildAuthResponse(user);
  user.refreshToken = auth.refreshToken;
  await user.save();
  res.status(StatusCodes.OK).json(auth);
}

export async function logout(req, res) {
  await User.findByIdAndUpdate(req.user.userId, { refreshToken: '' });
  res.status(StatusCodes.OK).json({ message: 'Logged out' });
}
