/*Сервісний модуль для роботи з контактами.
Повертає масив усіх контактів.
Повертає один контакт за унікальним ID.*/

import { Contact } from '../models/contact.js';

// Сервіс: працює з БД

// Повертає всі контакти
export async function getAllContacts() {
  return Contact.find();
}
// Повертає контакт за унікальним ID
export async function getContactById(contactId) {
  return Contact.findById(contactId);
}
// Створює новий контакт
export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
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
