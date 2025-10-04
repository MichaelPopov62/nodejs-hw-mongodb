/*Це файл роутів для роботи з контактами у Node.js/Express застосунку. Його основне призначення — визначати URL-шляхи (маршрути) і зв'язувати їх з відповідними контролерами, які обробляють запити.
Використовується middleware для перевірки валідності ID (isValidId).
Використовується Joi-схема для валідації тіла запиту (validateBody
Контролери обгорнуті в ctrlWrapper, щоб автоматично обробляти помилки.*/

import express from 'express'; //імпортую express
import {
  getContactByIdController,
  getContactsController,
  createContactController,
  deleteContactController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js'; // імпортую Joi-схеми
import { isValidId } from '../middlewares/isValidId.js';


const router = express.Router(); //створюю роутер



// Реєструю роут GET /contacts, який повертає всі контакти з бази даних
router.get('/', ctrlWrapper(getContactsController));

// додаю middleware isValidId для перевірки валідності ID перед викликом контролера getContactByIdController
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// Додаю валідацію на створення контакту
router.post(
  '/',
  validateBody(createContactSchema), // валідація тіла запиту за допомогою Joi-схеми
  ctrlWrapper(createContactController), //обгортка контролера для обробки помилок
);

// додаю валідацію на оновлення контакту
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema), // нова Joi-схема
  ctrlWrapper(updateContactController),
);

//додаю валідацію на видалення контакту
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
