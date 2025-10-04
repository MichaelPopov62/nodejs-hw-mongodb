/* Файл роутів для авторизації та управління користувачами (/auth).
Використовує express.Router() для організації маршрутизації.
Підключає контролери для обробки HTTP POST запитів:
  POST /register — реєстрація нового користувача
  де validateBody(registerUserSchema) перевіряє коректність даних (name, email, password)
  ctrlWrapper обгортає контролер для централізованої обробки помилок.
  POST /login — аутентифікація користувача
   де validateBody(loginUserSchema) перевіряє email і password.
  POST /refresh — оновлення сесії користувача за refresh токеном.
  POST /logout — видалення сесії користувача та очищення cookie.

  - Призначення: централізовано організувати маршрути для роботи з авторизацією, забезпечити валідацію даних і обробку помилок.
*/

import express from 'express'; //імпортую express
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserController } from '../controllers/auth.js';
import { registerUserSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema } from '../validation/auth.js';
import { loginUserController } from '../controllers/auth.js';
import { refreshUserSessionController } from '../controllers/auth.js';
import { logoutUserController } from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router(); //створюю роутер

router.post(
  '/register', //реєстрація
  validateBody(registerUserSchema), // валідація тіла запиту за допомогою Joi-схеми
  ctrlWrapper(registerUserController), //обгортка контролера для обробки помилок
);

router.post(
  '/login', //логін
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

// Новий роут для оновлення сесії,перевіряє токен і сесію, гарантує доступ тільки до власної сесії
router.post('/refresh', authenticate , ctrlWrapper(refreshUserSessionController));

//Новий роут для видалення сесії на основі id сесії,гарантує, що користувач видаляє тільки свою сесію
router.post('/logout', authenticate , ctrlWrapper(logoutUserController));

export default router;
