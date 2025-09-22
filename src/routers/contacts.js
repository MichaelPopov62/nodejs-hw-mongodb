/*Це файл роутів для роботи з контактами у Node.js/Express застосунку. Його основне призначення — визначати URL-шляхи (маршрути) і зв'язувати їх з відповідними контролерами, які обробляють запити.*/

import express from 'express'; //імпортую express
import {
  getContactByIdController,
  getContactsController,
  createContactController,
  deleteContactController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router(); //створюю роутер

// Реєстрація роута GET /contacts, який повертає всі контакти з бази даних
router.get('/', ctrlWrapper(getContactsController));

// Реєстрація роута GET /contacts/:contactId, який повертає контакт по id
router.get('/:contactId', ctrlWrapper(getContactByIdController));

//Створення нового контакту
router.post('/', ctrlWrapper(createContactController));

// для оновлення даних існуючого контакту.
router.patch('/:contactId', ctrlWrapper(updateContactController));

//видалення контакту
router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
