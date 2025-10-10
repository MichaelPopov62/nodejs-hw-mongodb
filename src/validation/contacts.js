// Файл визначає Joi-схеми валідації для, також дозволяє налаштувати текст помилок, які з'являються, якщо дані не проходять валідацію.

import Joi from 'joi'; //імпорт бібліотеки Joi для валідації даних

//Створюю Joi-схему з назвою createContactSchema. Вона описує, яким має бути об'єкт контакту.POST /contacts

export const createContactSchema = Joi.object({
  name: Joi.string() //це рядок (string),
    .min(3) //довжина від 3
    .max(20) //до 30 символів
    .required() // обов'язкове поле.

    //метод messages використовується для налаштування повідомлень про помилки валідації.
    .messages({
      'string.base': 'Name must be a string', //тип даних має бути рядком
      'string.min': 'Name must be at least {#limit} characters', //мінімальна довжина рядка вставляється автоматично при помилці на місце {#limit} береться значення з min яке я вказую при створенні схеми
      'string.max': 'Name must be at most {#limit} characters', //максимальна довжина рядка
      'any.required': 'Name is required', //поле є обов'язковим
    }),

  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email address',
  }), //це рядок, що відповідає формату електронної пошти. Не обов'язкове поле.

  phoneNumber: Joi.string() //рядок
    .pattern(/^\+?\d{10,15}$/) // метод Joi використовую регулярний вираз, який описує допустимий формат телефону(початок з + потім цифри від 10 до 15)
    .required()
    .messages({
      'string.pattern.base':
        'Phone number must be a valid international format',
      'any.required': 'Phone number is required',
    }),

  isFavourite: Joi.boolean()
   .truthy('true')//якщо з Postman приходить "true" (рядок), Joi сприймає як true
    .falsy('false')//якщо "false" то як false
    .default(false)//якщо не передано — ставить false автоматично
    .messages({
    'boolean.base': 'isFavourite must be true or false',
  }), //це булеве значення (true або false). Не обов'язкове.

  contactType: Joi.string() //це рядок
    .valid('home', 'work', 'personal') // повинен бути одним із заданих значень.
    .required()
    .messages({
      'any.only': 'Contact type must be one of [home, work, personal]',
      'any.required': 'Contact type is required',
    }),
});

//Схема updateContactSchema.PATCH/contacts/:contactId
export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least {#limit} characters',
    'string.max': 'Name must be at most {#limit} characters',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .messages({
      'string.pattern.base':
        'Phone number must be a valid international format',
    }),
  email: Joi.string().min(3).max(20).email().messages({
    'string.email': 'Email must be a valid email address',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite must be true or false',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Contact type must be one of [work, home, personal]',
  }),
})
  //забов'язує мати мінімум одне поле для оновлення
  .min(1)
  .messages({
    'object.min': 'At least one field is required for update',
  });
