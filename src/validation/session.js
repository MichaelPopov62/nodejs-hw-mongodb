/*Цей файл описує схему валідації сесії користувача за допомогою Joi.*/

import Joi from 'joi';

// Створюю схему для валідації створення сесії користувача
export const createSessionSchema = Joi.object({
  userId: Joi.string().length(24).hex().required().messages({
    'string.base': 'User ID must be text',
    'string.empty': 'User ID cannot be empty',
    'any.required': 'The User ID field is required',
  }), //додав перевірку довжини рядка ID та перевірку символів на відповідність MongoDB ObjectId щоб не було зайвих символів
  accessToken: Joi.string().required().messages({
    'string.base': 'Access Token must be text',
    'string.empty': 'Access Token cannot be empty',
    'any.required': 'The Access Token field is required',
  }),
  refreshToken: Joi.string().required().messages({
    'string.base': 'Refresh Token must be text',
    'string.empty': 'Refresh Token cannot be empty',
    'any.required': 'The Refresh Token field is required',
  }),
  accessTokenValidUntil: Joi.date().required().messages({
    'date.base': 'Access Token expiration date must be a valid date',
    'any.required': 'The Access Token expiration date field is required',
  }),
  refreshTokenValidUntil: Joi.date().required().messages({
    'date.base': 'Refresh Token expiration date must be a valid date',
    'any.required': 'The Refresh Token expiration date field is required',
  }),
});
