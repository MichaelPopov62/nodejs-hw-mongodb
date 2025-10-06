/* Middleware перевіряє, чи contactId у параметрах запиту є валідним ObjectId MongoDB.
   Якщо некоректний — повертає помилку 400. */

import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  let { contactId } = req.params;
  contactId = contactId.trim(); // прибираю зайві пробіли та символи переносу рядка
  req.params.contactId = contactId; // оновлюю параметр для контролера

  // кидаю HTTP помилку 400, якщо contactId некоректний
  if (!isValidObjectId(contactId)) {
    throw createHttpError(400, `Invalid contactId format: ${contactId}`);
  }

  next();
};
