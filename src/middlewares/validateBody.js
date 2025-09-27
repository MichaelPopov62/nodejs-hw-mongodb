/*Код перевіряє тіло запиту (req.body) за переданою Joi-схемою:*/

import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const errors = err.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    const error = createHttpError(400, 'Validation Error', { errors });
    next(error);
  }
};
