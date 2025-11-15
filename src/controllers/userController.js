import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';

export const updateUserProfile = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw createHttpError(404, 'user not found');
  }

  let { name, lastName, phone, city, novaPoshtaBranch } = req.user;

  if (req.body.firstName) name = req.body.name;
  if (req.body.lastName) lastName = req.body.lastName;
  if (req.body.phone) phone = req.body.phone;
  if (req.body.city) city = req.body.city;
  if (req.body.novaPoshtaBranch) novaPoshtaBranch = req.body.novaPoshtaBranch;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      name,
      lastName,
      phone,
      city,
      novaPoshtaBranch,
    },
    { new: true },
  );

  res.status(200).json(updatedUser);
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        throw createHttpError(404, 'User not found');
      }
      return res.status(200).json(user);
    }

    const { accessToken, refreshToken, sessionId } = req.cookies ?? {};

    if (!accessToken && !refreshToken && !sessionId) {
      return next(createHttpError(401, 'Unauthorized'));
    }

    let session = null;

    if (accessToken) {
      const found = await Session.findOne({ accessToken });
      if (found && new Date(found.accessTokenValidUntil) > new Date()) {
        session = found;
      }
    }

    if (!session && refreshToken && sessionId) {
      const oldSession = await Session.findOne({
        _id: sessionId,
        refreshToken,
      });

      if (!oldSession) {
        res.clearCookie('sessionId');
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return next(createHttpError(401, 'Session not found'));
      }

      const isRefreshExpired = new Date(oldSession.refreshTokenValidUntil) <= new Date();
      if (isRefreshExpired) {
        await Session.deleteOne({ _id: oldSession._id });
        res.clearCookie('sessionId');
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return next(createHttpError(401, 'Token expired'));
      }

      await Session.deleteOne({ _id: oldSession._id });
      const newSession = await createSession(oldSession.userId);
      setSessionCookies(res, newSession);
      session = newSession;
    }

    if (!session) {
      return next(createHttpError(401, 'Unauthorized'));
    }

    const user = await User.findById(session.userId).select('-password').lean();
    if (!user) {
      return next(createHttpError(401, 'Unauthorized'));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
