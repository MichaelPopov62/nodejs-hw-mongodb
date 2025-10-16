

/* Контролери для аутентифікації користувачів:
   Реєстрація, логін, оновлення сесії, вихід, скидання пароля */

import { registerUser, loginUser, refreshSession, logoutUser, requestResetToken, resetPassword } from '../services/auth.js';
import { registerUserSchema } from '../validation/auth.js';
import { ONE_DAY } from '../constants/index.js';

/* Реєстрація користувача */
export const registerUserController = async (req, res, next) => {
  try {
    const { value, error } = registerUserSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Bad Request',
        errors: error.details.map((d) => d.message),
      });
    }

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

/* Логін користувача */
export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      maxAge: Math.max(session.refreshTokenValidUntil.getTime() - Date.now(), 0),
    });

    res.cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      maxAge: ONE_DAY,
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in an user!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

/* Оновлення сесії на основі refreshToken */
export const refreshSessionController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token not found',
      });
    }

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
      data: { accessToken: newSession.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

/* Видалення сесії */
export const logoutUserController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (sessionId || refreshToken) {
      await logoutUser(sessionId, refreshToken);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/* Відправка email для скидання пароля */
export const requestResetEmailController = async (req, res, next) => {
  try {
    await requestResetToken(req.body.email);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/* Зміна пароля за токеном */
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
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token is expired or invalid.',
      });
    }
    next(error);
  }
};
