/*Код перевіряє тіло запиту (req.body) за переданою Joi-схемою. Якщо валідація не пройшла — повертає помилку 400 (Bad Request) з описом помилок. */

import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next(); // якщо помилки немає, передаю управління далі
  } catch (err) {
    const error = createHttpError(400, 'Bad Request', { errors: err.details });
    next(error); // передаю помилку в глобальний errorHandler
  }
};
