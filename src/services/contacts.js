/*Сервісний модуль для роботи з контактами.Він реалізує логіку взаємодії з базою даних через Mongoose та надає функції для CRUD-операцій (створення, читання, оновлення, видалення).
Поступово виконую діі з допомогою патерна "query builder":
  - пагінації (page, perPage)
 - сортування (sortBy, sortOrder)
 - фільтрації (contactType, isFavourite)
 Promise.all — дозволяє виконувати два запити одночастно, отримувати результат одночасно це економити час.*/

import { Contact } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

// Повертаю всі контакти
export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortBy,
  sortOrder,
  filter = {}, // дода. фільтр як параметр
}) {
  // Перетворюю параметри у числа та задаю дефолтні значення
  const pageNumber = Number(page?.toString().trim()) || 1;
  const perPageNumber = Number(perPage?.toString().trim()) || 10;
  const limit = perPageNumber; // limit — кількість елементів на сторінку (якщо не передані, то 10)
  const skip =
    (pageNumber - 1) *
    perPageNumber; /* Обчислюю, скільки документів потрібно пропустити,щоб отримати саме записи поточної сторінки.*/

  /* Використовую патерн  "query builder" з Mongoose для побудови запиту.Це буде базовий запит до колекції Contact без умов,тобто find().*/
  let query = Contact.find();

  /*Роблю фільтрацію.Якщо передано тип контакту,тоді додаю умову.Використовую метод
.equals() задає значення, з яким повинно співпадати поле isFavourite.*/

  if (filter.contactType) {
    query = query.where('contactType').equals(filter.contactType);
  }
  // Якщо передано isFavourite, додаю умову
  if (filter.isFavourite !== undefined) {
    query = query.where('isFavourite').equals(filter.isFavourite);
  }

  // роблю сортування, збепігаю напрямок за допомогою змінноі.
  if (sortBy) {
    const order = sortOrder === 'asc' ? 1 : -1;
    query = query.sort({ [sortBy]: order });
  }

  // Отримую контакти з урахуванням пагінації.
  query = query.skip(skip).limit(limit);

  // Виконую запити паралельно
  const [contacts, totalItems] = await Promise.all([
    query.exec(), // дані контактів для поточної сторінки
    Contact.countDocuments(filter), // загальна кількість документів з урахуванням фільтра
  ]);

  // Формую метадані пагінації,кількість сторінок, попередня/наступна сторінка
  const pagination = calculatePaginationData(totalItems, limit, pageNumber);

  return {
    data: contacts, // масив контактів для поточної сторінки
    ...pagination, ////  дані пагінаціі
  };
}

// Повертає контакт за унікальним ID
export async function getContactById(contactId) {
  return Contact.findById(contactId);
}
// Створює новий контакт
export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  const { name, phoneNumber, email, isFavourite, contactType } = contact._doc;
  return { name, phoneNumber, email, isFavourite, contactType };
};

// Оновлює дані існуючого контакту.
export const updateContact = async (contactId, payload) => {
  const contact = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
    runValidators: true,
  });
  return contact;
};
// Видаляє контакт за ID з бази даних
export const deleteContact = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};
