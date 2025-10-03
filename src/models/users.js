/*Цей файл описує структуру даних у базі MongoDB для:
Користувачів (users) — зберігає ім'я, email та пароль.
Сесій (sessions) — зберігає дані про авторизацію користувача: токени і час їх дії.*/

import { model, Schema } from 'mongoose';

// Описую схему користувача
const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true }, //unique-гарантує що пошта унікальна
    password: { type: String, required: true },
  },
  {
    timestamps: true, //  автоматично додає createdAt і updatedAt
    versionKey: false, // автоматично прибирає versionKey (__v)тобто версію документа
  },
);

// Додаю метод toJSON для видалення пароля перед відправкою клієнту
usersSchema.methods.toJSON = function () {
  const obj = this.toObject(); // перетворюю документ mongoose на звичайний об'єкт JS
  delete obj.password; // видаляю поле password
  return obj; // повертаю вже "очищений" об'єкт
};

export const UserCollection = model('users', usersSchema);
