/* Файл: Сервіс для роботи з користувачами та сесіями (/services/auth.js)
 Призначення:
    -Логіка взаємодії з базою даних користувачів (UserCollection) і сесій (SessionCollection).
    - Реєстрація нового користувача з хешуванням пароля.
    - Логін користувача: перевірка email та пароля, створення нової сесії з access і refresh токенами.
    - Оновлення сесії на основі refresh токена.
    - Логаут користувача: видалення сесії та очищення токенів.
    - Створення нових токенів (accessToken, refreshToken) з обмеженим часом життя.
Особливості:
    - bcrypt використовується для хешування пароля.
    - createHttpError для централізованого оброблення помилок (HTTP 400, 401, 404, 409).
    - randomBytes генерує криптографічно безпечні токени.
    - Кожна операція по сесії гарантує, що стара сесія видаляється перед створенням нової.
    - refreshUsersSession — окрема функція для оновлення існуючої сесії, перевіряє дійсність токена.
*/

import bcrypt from 'bcrypt';
import { UserCollection } from '../models/users.js';
import { SessionCollection } from '../models/session.js';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import {
  SIXTY_MINUTES,
  FIFTEEN_MINUTES,
  THIRTY_DAYS,
  ONE_DAY,
} from '../constants/index.js';
import { sendMail } from '../utils/sendMail.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

dotenv.config();//для доступу до змінних оточення

// Одноразове завантаження шаблону листа в памʼять.ЦЕ БУДЕ ЗНАХОДИТИСЯ В ОПЕРАТИВНІЙ ПАМ'ЯТІ
const REQUEST_PASSWORD_RESET_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/send-reset-email.html'),
  { encoding: 'UTF-8' },
);

//компілюю шаблон
const sendResetEmailTemplate = Handlebars.compile(
  REQUEST_PASSWORD_RESET_TEMPLATE,
);

//Реєстрація нового користувача у колекції де payload — об'єкт з даними користувача: { name, email, password }
export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email }); //знайти один документ у колекції, який відповідає умовам

  if (user) throw createHttpError(409, 'Email in use');

  /* Хешую пароль і замінюю у payload, bcrypt.hash(payload.password, 10) — хешує пароль із 10 раундами "солі".Чим більше раундів, тим сильніший хеш, але тим повільніше операція.*/
  payload.password = await bcrypt.hash(payload.password, 10);

  //метод create повертає створений об'єкт з уже зміненим payload
  return await UserCollection.create(payload);
};

// Логін: перевірка + створення токенів і сесії
export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  // Якщо користувача з таким email немає тоді помилка
  if (!user) throw createHttpError(404, 'User not found');

  //  Порівнюю введений пароль з тим, що збережений у БД (захешований)
  const isEqual = await bcrypt.compare(payload.password, user.password); // Порівнюю хеші паролів метод compare()

  // Якщо паролі не співпали тоді помилка
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  // Видаляю стару сесію (якщо була)
  await SessionCollection.deleteOne({ userId: user._id });

  // Генерую нові токени
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  // Створюю нову сесію
  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + SIXTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

/* Оновлення сесії по refreshToken */
export const refreshSession = async (refreshTokenFromCookie) => {
  if (!refreshTokenFromCookie)
    throw createHttpError(401, 'Refresh token missing');

  // Знаходжу стару сесію
  const oldSession = await SessionCollection.findOne({
    refreshToken: refreshTokenFromCookie,
  });
  if (!oldSession) throw createHttpError(404, 'Session not found');

    // Перевіряю, чи не закінчився токен
  if (new Date() > new Date(oldSession.refreshTokenValidUntil)) {
    // удаляємо стару сесію для чистоти
    await SessionCollection.deleteOne({ _id: oldSession._id });
    throw createHttpError(401, 'Refresh token expired');
  }

  // Видаляю стару сесію
  await SessionCollection.deleteOne({ _id: oldSession._id });

  // Генерую нові токени
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  // Створюю нову сесію
  const newSession = await SessionCollection.create({
    userId: oldSession.userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + SIXTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
  return newSession;
};

export const logoutUser = async (sessionId, refreshToken) => {
  if (!sessionId && !refreshToken) {
    throw createHttpError(400, 'No session identifier provided');}

    const query = {};
    if (sessionId) query._id = sessionId;
    if (refreshToken) query.refreshToken = refreshToken;
    await SessionCollection.deleteOne(query);
  };


//оновлення сессіі
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + SIXTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};




//  скидання паролю через емейл
export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
    return;
  }

  const token = jwt.sign(
    { sub: user._id, email }, //sub-індефтифікатор користувача
    process.env.JWT_SECRET,
    { expiresIn: '5m' }, // по завданню 5 хвилин
  );

  // const resetPasswordLink = `${
  //   process.env.APP_DOMAIN || 'http://localhost:3000/auth'
  // }/reset-password?token=${token}`;

  const resetPasswordLink = new URL(
  `/auth/reset-password?token=${token}`,
  process.env.APP_DOMAIN || 'http://localhost:3000'
).toString();



//  надсилаю листа
  try {
    await sendMail({
      to: email,
      subject: 'Reset password instruction',
      html: sendResetEmailTemplate({ resetPasswordLink }),
      from: process.env.SMTP_FROM,
    });

  } catch (err) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
  return token;
};

// зміна паролю по токену
export const resetPassword = async (token, password) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); //перевіряю токен

    //знаходжу користувача по email і id
    const user = await UserCollection.findOne({
      email: payload.email,
      _id: payload.sub,
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    // Хешую новий пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    // Оновлюю пароль у користувача
    await UserCollection.updateOne(
      { _id: payload.sub },
      { password: hashedPassword },
    );

    // Видаляю всі сесії користувача
    await SessionCollection.deleteMany({ userId: user._id });
  } catch (err) {
    //Обробка JWT помилок
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    throw err;
  }
};
