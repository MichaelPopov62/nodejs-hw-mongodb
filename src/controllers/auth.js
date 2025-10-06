/* Контролери для аутентифікації користувачів.Реєстрація, логін, оновлення сесії, вихід*/
import Joi from 'joi';

import { registerUser, loginUser } from '../services/auth.js';
import { registerUserSchema } from '../validation/auth.js';
import { ONE_DAY } from '../constants/index.js';
import { refreshSession } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';
import { refreshUsersSession } from '../services/auth.js';


/* POST /auth/register -контролер для реєстрації користувача. req.body — дані, які надіслав клієнт (name, email, password) */
export const registerUserController = async (req, res, next) => {
  try {
    //  Валідація даних через Joi
    const { value, error } = registerUserSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      // Якщо є помилки валідації, повертаю 400
      return res.status(400).json({
        status: 'error',
        message: 'Bad Request',
        errors: error.details.map((d) => d.message),
      });
    }

    /*  Реєстрація користувача через сервіс.Сервіс сам хешує пароль і перевіряє унікальність email*/
    const newUser = await registerUser(value);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/login- Логін користувача та створення сесії
export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body); // повертає об'єкт сесії з токенами

    // Встановлюю refreshToken  та sessionId у cookie
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      maxAge: Math.max(
        session.refreshTokenValidUntil.getTime() - Date.now(),
        0,
      ), //дату, до якої токен дійсний (refreshTokenValidUntil), віднімаю поточний час (Date.now()) і отримую залишок часу життя токена в мілісекундах.
    });

    // Встановлюю sessionId у cookie
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      maxAge: ONE_DAY, // 1 день
    });

    // Відповідаю accessToken
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in an user!',
      data: { accessToken: session.accessToken }, //Повертаю клієнту accessToken для авторизації запитів
    });
  } catch (error) {
    next(error);
  }
};


/*POST / auth / refresh - user - session-оновлення сесії на основі sessionId та refreshToken з cookies*/
export const refreshUserSessionController = async (req, res, next) => {
  try {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

      res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      maxAge: session.refreshTokenValidUntil.getTime() - Date.now(),
    });

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      maxAge: ONE_DAY,
    });


    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


// POST /auth/logout-видалення сесії користувача
export const logoutUserController = async (req, res, next) => {
  try {
    const { sessionId} = req.cookies;// отримуємо кукі

     if (typeof sessionId === "string") {
      await logoutUser( sessionId); //видаляю сесію з БД
    }

    // Очищую cookies на клієнті
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};




