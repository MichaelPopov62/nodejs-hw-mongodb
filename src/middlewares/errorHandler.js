/* Глобальний middleware для обробки помилок.
   Якщо помилка створена через createHttpError — повертає відповідний статус та повідомлення.
   Для всіх інших помилок — повертає 500 Internal Server Error. */

import {HttpError} from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // Якщо це очікувана помилка (створена через createHttpError
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      status: String(err.status), // статус з помилки (наприклад, 409,401,400)
      message: err.name || 'Error', // повідомлення про помилку текст,який передаю у createHttpError
      data: { message: err.message }, // повідомлення у data
    });
  }

  // Для всіх інших помилок — 500 Internal Server Error
  res.status(500).json({
    status: '500',
    data: { message: err.message || 'Something went wrong' },
  });
};
