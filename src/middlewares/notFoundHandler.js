/* Middleware для обробки запитів на неіснуючі маршрути.
   Викликається, якщо жоден з роутів не спрацював, і повертає 404. */

import createHttpError from 'http-errors';

export function notFoundHandler(req, res, next) {
  next(createHttpError(404, 'Contact not found'));
}
