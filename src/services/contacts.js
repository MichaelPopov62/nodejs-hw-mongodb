/*Сервісний модуль для роботи з контактами.
Повертає масив усіх контактів.
Повертає один контакт за унікальним ID.*/

import { Contact } from '../models/contact.js';

// Сервіс: працює з БД
export async function getAllContacts() {
  return Contact.find();
}
// Сервіс: повертає контакт за ID
export async function getContactById(contactId) {
  return Contact.findById(contactId);
}
