/*ЗАВДАННЯ коду-обробляти HTTP-запити,
 Взаємодіяти із сервісом(services/contacts.js), де міститься логіка роботи з базою даних (MongoDB через Mongoose).
 Формувати відповіді для клієнта у форматі JSON із статусом, повідомленням та даними.Обробляти помилки через createHttpError.Завантаження файлів на Cloudinary*/

import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// Отримання списку контактів користувача з пагінацією, фільтрацією та сортуванням.
export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    // Отримую всі контакти з урахуванням пагінації
    const result = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id, // беру безпосередньо з middleware
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Отримання одного контакту по id (тільки свій).
export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await getContactById(contactId, req.user._id); // шукаю тільки свої контакти

    if (!contact) throw createHttpError(404, 'Contact not found');

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

// Створення нового контакту. Завантаження фото на Cloudinary (якщо є).
export const createContactController = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      isFavourite = false,
      contactType,
    } = req.body;

    if (!name || !phoneNumber || !contactType) {
      throw createHttpError(
        400,
        'Missing required fields: name, phoneNumber, contactType',
      );
    }


    // Завантаження фото на Cloudinary, якщо воно є в запиті
      let photoUrl = null;// якщо фото немає
    if (req.file) {
      photoUrl = await saveFileToCloudinary(req.file.buffer); // завантаження на Cloudinary
    }


    const newContact = await createContact({
      name,
      email,
      phoneNumber,
      isFavourite,
      contactType,
      userId: req.user._id, // обов'язково
      photo: photoUrl, // додаю URL фото до контакту
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (err) {
    next(err); // передаю помилку в errorHandler
  }
};

// Оновлення існуючого контакту. Можливе оновлення фото через Cloudinary.
export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
        if (req.file) {
      const photoUrl = await saveFileToCloudinary(req.file.buffer);
      req.body.photo = photoUrl; // додаю URL до оновлення
    }

    const contact = await updateContact(contactId, req.body, req.user._id); // оновлюю тільки свій контакт

    if (!contact) throw createHttpError(404, 'Contact not found');

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

// Видалення контакту користувача. Повертає статус 204 без тіла.
export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await deleteContact(contactId, req.user._id); // видаляю тільки свій контакт

    if (!contact) throw createHttpError(404, 'Contact not found');

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
