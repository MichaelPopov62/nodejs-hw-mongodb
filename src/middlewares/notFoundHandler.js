/*ЗАВДАННЯ коду-для обробки випадків, коли маршрут не знайдено
notFoundHandler викликається, якщо жоден маршрут не відповідає запиту клієнта.*/

import createHttpError from 'http-errors'; //це функція з бібліотеки http-errors, яка використовується для створення HTTP-помилок із заданим статус-кодом і повідомленням.

export function notFoundHandler(req, res, next) {
  next(createHttpError(404, 'Route not found'));
}
