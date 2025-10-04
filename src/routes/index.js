/*
  Основний файл роутів додатку. Використовує express.Router() для організації маршрутизації.Підключає підмаршрути:
      1. /contacts — всі маршрути для роботи з контактами (CRUD операції).
      2. /auth — маршрути для авторизації та управління користувачами
         (реєстрація, логін, оновлення сесії, логаут).
  Експортує готовий router для підключення у головному файлі серверу (server.js).

  Призначення: централізовано організувати маршрути, щоб підтримувати чисту структуру проекту.
*/

import { Router } from 'express';
import contactsRouter from './contacts.js'; // роут для контактів
import authRouter from './auth.js'; // роут для авторизації та користувачів
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

// Підключаю роут для контактів.Всі роути для контактів захищені
router.use('/contacts',authenticate, contactsRouter);

/* Підключаю роут для користувачів (реєстрація, логін).
Роути auth залишаються відкритими, але всередині auth.js є authenticate для захищених операцій*/

router.use('/auth', authRouter);

export default router;
