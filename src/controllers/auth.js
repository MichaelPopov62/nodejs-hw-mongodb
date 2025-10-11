/*Контролери для аутентифікації користувачів.
   Реєстрація, логін, оновлення сесії, вихід, скидання пароля */

import Joi from 'joi';

import { registerUser, loginUser } from '../services/auth.js';//
import { registerUserSchema } from '../validation/auth.js';//
import { ONE_DAY } from '../constants/index.js';//
import { refreshSession } from '../services/auth.js';//
import { logoutUser } from '../services/auth.js';//
import { requestResetToken } from '../services/auth.js';
import { resetPassword } from '../services/auth.js';


/* Реєстрація користувача. Валідація через Joi, хешування пароля в сервісі, повертає нового користувача.*/
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

//Логін користувача, створення сесії, встановлення refreshToken і sessionId у cookie, повертає accessToken
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
    res.cookie('sessionId', session._id.toString(), {
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


/*Оновлення сесії на основі refreshToken з cookie, повертає новий accessToken*/
export const refreshSessionController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
     if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token not found',
      });
    }
    // Встановлюю новий refreshToken у cookie
    const newSession = await refreshSession(refreshToken);

    res.cookie('refreshToken', newSession.refreshToken, {
      httpOnly: true,
      maxAge: newSession.refreshTokenValidUntil.getTime() - Date.now(),
    });

    res.cookie('sessionId', newSession._id, {
      httpOnly: true,
      maxAge: ONE_DAY,
    });
    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: newSession.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Видалення сесії з БД, очищення cookie (sessionId і refreshToken
export const logoutUserController = async (req, res, next) => {
  try {
    const { sessionId,refreshToken } = req.cookies;// отримуємо кукі

     if (sessionId || refreshToken) {
      await logoutUser( sessionId,refreshToken); //видаляю сесію з БД
    }

    // Очищую cookies на клієнті
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

//оновлюю сессію
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    maxAge: ONE_DAY,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    maxAge: ONE_DAY,
  });
};

//Відправка email для скидання пароля.
export const requestResetEmailController = async (req, res, next) => {
  try {
    const token = await requestResetToken(req.body.email); //зберігаю результат

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

//Зміна пароля за токеном. Перевірка валідності пароля.
export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    await resetPassword(token, password);
    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset',
      data: {},
    });
  } catch (error) {

    // Обробка JWT помилок
      if (
      error.name === 'TokenExpiredError' || //якщо токен прострочений
      error.name === 'JsonWebTokenError'    //або токен недійсний (пошкоджений, неправильний формат, підроблений тощо
    )
    {
      return next(createHttpError(401, 'Token is expired or invalid.'));
    }

    next(error);
  }
};





