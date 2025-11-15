// import createHttpError from 'http-errors';
// import { Session } from '../models/session.js';
// import { User } from '../models/user.js';

// export const authenticate = async (req, res, next) => {
//   const { accessToken } = req.cookies;

//   if (!accessToken) {
//     if (req.path === '/auth/session' && req.method === 'GET') {
//       return next();
//     }
//     return next(createHttpError(401, 'Missing access token'));
//   }

//   const session = await Session.findOne({ accessToken });

//   if (!session) {
//     if (req.path === '/auth/session' && req.method === 'GET') {
//       return next();
//     }
//     return next(createHttpError(401, 'Session not found'));
//   }

//   const isAccessTokenExpired = new Date(session.accessTokenValidUntil) < new Date();

//   if (isAccessTokenExpired) {
//     if (req.path === '/auth/session' && req.method === 'GET') {
//       return next();
//     }
//     return next(createHttpError(401, 'Access token expired'));
//   }

//   const user = await User.findById(session.userId);

//   if (!user) {
//     return next(createHttpError(401));
//   }

//   req.user = user;
//   next();
// };

// export const checkAdmin = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Доступ заборонено! Лише для адміністраторів.' });
//   }
//   next();
// };
import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    // Для публичных роутов, которые могут работать без аутентификации, пропускаем
    if (isPublicRoute(req.path, req.method)) {
      return next();
    }
    return next(createHttpError(401, 'Missing access token'));
  }

  const session = await Session.findOne({ accessToken });

  if (!session) {
    if (isPublicRoute(req.path, req.method)) {
      return next();
    }
    return next(createHttpError(401, 'Session not found'));
  }

  const isAccessTokenExpired = new Date(session.accessTokenValidUntil) < new Date();

  if (isAccessTokenExpired) {
    if (isPublicRoute(req.path, req.method)) {
      return next();
    }
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);

  if (!user) {
    return next(createHttpError(401));
  }

  req.user = user;
  next();
};

// Функция для определения публичных роутов
function isPublicRoute(path, method) {
  const publicRoutes = [
    { path: '/auth/session', method: 'GET' },
    { path: '/auth/refresh', method: 'POST' },
    { path: '/auth/logout', method: 'POST' },
    // Добавьте другие публичные роуты по необходимости
  ];

  return publicRoutes.some(route => 
    route.path === path && route.method === method
  );
}

export const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ заборонено! Лише для адміністраторів.' });
  }
  next();
};