/* Основний модуль Express-сервера.
   Відповідає за налаштування сервера, middleware, роутів та підключення до MongoDB * В ньому буде знаходитись логіка роботи express-серверу.Передаю данні дляпідключення*/

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { initMongoConnection } from './db/initMongoConnection.js';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

// Завантажую змінні оточення
dotenv.config();

export function setupServer() {
  //  Створення сервера
  const app = express();

  // Підключаю JSON middleware
  app.use(express.json());
  //Налаштування cors

  app.use(cors()); // Налаштування дозвол для всіх використовуючі метод use

  // Підключення cookie-parser
  app.use(cookieParser());

  //Налаштування pino використовуючі метод use
  app.use(pinoHttp()); //функція яка імпортується з бібліотеки pino-http

  app.use(router); // Тепер запити виглядають так:
  // GET /contacts       → contactsRouter
  // POST /contacts      → contactsRouter
  // POST /auth/register → authRouter

  /* Додатковий рут для головної сторінки. Коли користувач заходить https://nodejs-hw-mongodb-zpxp.onrender.com/, сервер повертає просте повідомлення.
Це не стосується бази даних — просто інформативне повідомлення для того, хто відкрив головний URL.*/
  app.get('/', (req, res) => {
    res.json({
      message:
        'Welcome to Node.js MongoDB API! Visit /contacts to see all contacts.',
    });
  });

  // Обробка помилок
  app.use(notFoundHandler); // Middleware для неіснуючих маршрутів
  app.use(errorHandler); // Централізована обробка помилок

  //Отримую порт з .env або 3000
  const PORT = process.env.PORT || 3000;

  //Формую URI для MongoDB
  const mongoUri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

  // Ініціалізація підключення до MongoDB, а потім запуск сервера
  initMongoConnection(mongoUri)
    .then(() => {
      console.log('MongoDB connected successfully');
      // Запуск сервера
      app.listen(PORT, (error) => {
        if (error) {
          console.error('Error occurred while starting server:', error);
        } else {
          console.log(`Server is running on port ${PORT}`);
        }
      });
    })
    .catch((err) => {
      console.error('MongoDB connection failed:', err);
      process.exit(1); // якщо не підключилось, тоді завершую процес
    });

  //Обробка необроблених помилок
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });

  return app;
}
