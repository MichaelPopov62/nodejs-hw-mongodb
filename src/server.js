/* В ньому буде знаходитись логіка роботи express-серверу.
Передаю данні для підключення*/
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { initMongoConnection } from './db/initMongoConnection.js';
import { Contact } from './models/contact.js';

// Завантажую змінні оточення
dotenv.config();

export function setupServer() {
  // 1. Створення сервера
  const app = express();

  //Налаштування cors та логгера pino використовуючі метод use
  app.use(cors()); // дозвол для всіх джерел
  app.use(pinoHttp()); //функція яка імпортується з бібліотеки pino-http

  // Підключаю JSON middleware
  app.use(express.json());

  // Реєстрація роута GET /contacts, який повертає всі контакти з бази даних
  app.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await Contact.find(); //метод find() повертає всі документи з колекції contacts

      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      next(error);
    }
  });

  // Реєстрація роута GET /contacts/:contactId, який повертає контакт по id
  app.get('/contacts/:contactId', async (req, res, next) => {
    try {
      const { contactId } = req.params;

      const contact = await Contact.findById(contactId);

      if (contact === null) {
        return res.status(404).json({
          status: 404,
          message: 'Contact not found',
        });
      }

      res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  });

  /* Додатковий рут для головної сторінки. Коли користувач заходить https://nodejs-hw-mongodb-zpxp.onrender.com/, сервер повертає просте повідомлення.
Це не стосується бази даних — просто інформативне повідомлення для того, хто відкрив головний URL.*/
  app.get('/', (req, res) => {
    res.json({
      message:
        'Welcome to Node.js MongoDB API! Visit /contacts to see all contacts.',
    });
  });

  //Обробка неіснуючих роутів
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

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
