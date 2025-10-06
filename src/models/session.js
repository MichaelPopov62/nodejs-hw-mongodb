/*Цей файл описує модель сесії користувача для MongoDB за допомогою Mongoose. */

import { Schema, model } from 'mongoose';

//описую схему для колекції sessions

const sessionSchema = new Schema(
  {
    userId: { type: String, required: true }, //ідентифікатор користувача, який належить цій сесії
    accessToken: { type: String, required: true }, //  токен доступу, потрібний для авторизації користувача
    refreshToken: { type: String, required: true }, // токен для отримання нового accessToken після його закінчен
    accessTokenValidUntil: { type: Date, required: true }, //дата і час, коли токен доступу перестає бути дійсним
    refreshTokenValidUntil: { type: Date, required: true }, //  дата і час, коли токен оновлення перестає бути дійсним
  },
  {
    versionKey: false, // прибирає автоматичне поле __v (версія документа)
  },
);
export const SessionCollection = model('sessions', sessionSchema);
