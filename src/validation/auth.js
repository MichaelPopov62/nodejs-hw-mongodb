import Joi from 'joi';

// Створюю схему для валідації даних користувача при реєстрації
export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least {#limit} characters',
    'string.max': 'Name must be at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().lowercase().required().messages({
    'string.base': 'Email must be text',
    'string.email': 'Enter a valid email',
    'string.empty': 'Email cannot be empty',
    'any.required': 'The email field is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be text',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must contain at least 6 characters',
    'any.required': 'The password field is required',
  }),
});

//схема для валідаціі логіна
export const loginUserSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    'string.base': 'Email must be a string.',
    'string.empty': 'The email field cannot be empty.',
    'string.email': 'Enter a valid email.',
    'any.required': 'The email field is required.',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string.',
    'string.empty': 'The password field cannot be empty.',
    'any.required': 'The password field is required.',
  }),
});
