/*
  Файл: Сервіс для роботи з контактами (/services/contacts.js)
Призначення:
    - Логіка взаємодії з базою даних контактів через Mongoose.
    - CRUD-операції для контактів користувача: створення, читання, оновлення, видалення.
 Підтримка:
        - Пагінації (page, perPage)
        - Сортування (sortBy, sortOrder)
        - Фільтрації (contactType, isFavourite)
    - Гарантує, що користувач бачить лише свої контакти (filter by userId).
Особливості:
    - Використовує calculatePaginationData для формування метаданих пагінації (кількість сторінок, наступна/попередня сторінка).
    - Перевіряє валідність ObjectId для contactId та userId.
    - findOneAndUpdate / findOneAndDelete гарантують, що змінюються/видаляються тільки контакти конкретного користувача.
*/

import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { Contact } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

// Отримую всі контакти з пагінацією, фільтром і сортуванням
export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortBy,
  sortOrder,
  filter = {},
  userId,
}) {
  // Перевіряю, чи коректний userId (щоб уникнути помилок у БД)
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createHttpError(400, 'Invalid user ID');
  }

  // Перетворюю параметри у числа та задаю дефолтні значення
  const pageNumber = Number(page?.toString().trim()) || 1;
  const perPageNumber = Number(perPage?.toString().trim()) || 10;
  const limit = perPageNumber;
  const skip = (pageNumber - 1) * perPageNumber;

  /* Створюю запит до колекції Contact.Завжди фільтрую за userId — користувач бачить лише свої контакти*/
  const contactsQuery = Contact.find({ ...filter, userId });

  // Рахую кількість усіх контактів, які підпадають під умову (для побудови пагінації)
  const totalItems = await Contact.countDocuments({ ...filter, userId });

  // Отримую контакти для поточної сторінки з урахуванням сортування та пагінації
  const contacts = await contactsQuery
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .exec();

  // Формую метадані пагінації,кількість сторінок, попередня/наступна сторінка
  const pagination = calculatePaginationData(totalItems, limit, pageNumber);

  return {
    data: contacts, // масив контактів для поточної сторінки
    ...pagination, // дані пагінації
  };
}

// Отримати один контакт по ID — лише свій
export async function getContactById(contactId, userId) {
  if (!mongoose.Types.ObjectId.isValid(contactId))
    throw createHttpError(400, 'Invalid contact ID');

  if (!mongoose.Types.ObjectId.isValid(userId))
    throw createHttpError(400, 'Invalid user ID');

  return Contact.findOne({ _id: contactId, userId }); //  userId
}

// Створює новий контакт
export const createContact = async (payload) => {
  if (!payload.userId || !mongoose.Types.ObjectId.isValid(payload.userId)) {
    throw createHttpError(400, 'Invalid user ID');
  }

  return Contact.create(payload); // payload  містить userId
};

// Оновити контакт (частково) — лише свій
export const updateContact = async (contactId, payload, userId) => {
  if (!mongoose.Types.ObjectId.isValid(contactId))
    throw createHttpError(400, 'Invalid contact ID');

  if (!mongoose.Types.ObjectId.isValid(userId))
    throw createHttpError(400, 'Invalid user ID');

  return Contact.findOneAndUpdate(
    { _id: contactId, userId }, // тільки свої контакти
    payload,
    { new: true, runValidators: true },
  );
};

// Видалити контакт за ID  з бази даних лише своі
export const deleteContact = async (contactId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(contactId))
    throw createHttpError(400, 'Invalid contact ID');

  if (!mongoose.Types.ObjectId.isValid(userId))
    throw createHttpError(400, 'Invalid user ID');

  return Contact.findOneAndDelete({ _id: contactId, userId }); // тільки свої контакти
};
