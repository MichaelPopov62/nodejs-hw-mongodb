/*ЗАВДАННЯ коду-централізовано ловити помилки, що виникають у контролерах, і повертати клієнту зрозумілу відповідь з відповідним HTTP-статусом.*/
import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    status: 500, // статус 500
    message: 'Something went wrong', // стандартне повідомлення беру з err.name
    data: err.message, // конкретне повідомлення помилки беру з err.message
  });
};
