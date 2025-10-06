import createHttpError from 'http-errors';
import { SessionCollection } from '../models/session.js';
import { UserCollection } from '../models/users.js';

export const authenticate = async (req, res, next) => {
  try{
  const authHeader = req.headers.authorization; // дістаю заголовок
  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }
  // Очікую формат: "Bearer token"
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  // Шукаю сесію з цим токеном
  const session = await SessionCollection.findOne({ accessToken: token });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }
  // Перевірка на простроченість access токена
  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  // Знаходжу користувача
  const user = await UserCollection.findById(session.userId);
  if (!user) {
    return next(createHttpError(401));
  }

  // Додаю користувача в req
  req.user = user;
  req.session = session;
  next();
    } catch (error) {
    next(error);
  }
};
