/*ЗАВДАННЯ коду-централізовано ловити помилки, що виникають у контролерах, і повертати клієнту зрозумілу відповідь з відповідним HTTP-статусом.*/
import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).json({
    status,
    message,
    data: null,
  });
};
