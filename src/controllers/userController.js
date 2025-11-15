import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const updateUserProfile = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw createHttpError(404, 'user not found');
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...req.user
    },
    { new: true }
  );

  res.status(200).json(updatedUser);
};


export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
