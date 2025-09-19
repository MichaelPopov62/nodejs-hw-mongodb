/*ЗАВДАННЯ коду-централізовано ловити помилки, що виникають у контролерах, і повертати клієнту зрозумілу відповідь з відповідним HTTP-статусом.*/

// Імпортуємо клас HttpError для обробки помилок HTTP (400, 404)
import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // Якщо це очікувана помилка (створена через createHttpError)
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: 'error', // статус з помилки (наприклад, 404, 400)
      message: err.name, // повідомлення про помилку беру з бібліотеки http-errors
      data: err, // конкретне повідомлення для клієнта беру з err.message
    });
    return;
  }

  // Для всіх інших помилок — 500 Internal Server Error
  res.status(500).json({
    status: 500, // статус 500
    message: 'Something went wrong', // стандартне повідомлення беру з err.name
    data: err.message, // конкретне повідомлення помилки беру з err.message
  });
};
