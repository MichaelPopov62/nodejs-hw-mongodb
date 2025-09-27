/*Код перевіряє, чи є contactId у параметрах запиту валідним ObjectId MongoDB.*/

import { isValidObjectId } from 'mongoose';

import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    throw createHttpError(400, `Invalid contactId format: ${contactId}`);
  }

  next();
};
