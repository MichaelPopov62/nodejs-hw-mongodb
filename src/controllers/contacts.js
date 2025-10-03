/*ЗАВДАННЯ коду-обробляти HTTP-запити,
 Взаємодіяти із сервісом(services/contacts.js), де міститься логіка роботи з базою даних (MongoDB через Mongoose).
 Формувати відповіді для клієнта у форматі JSON із статусом, повідомленням та даними.Обробляти помилки через createHttpError.*/

import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

// Отримую всі контакти
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

// GET /contacts/:id — отримую контакт по id (тільки свій)
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

// POST /contacts — створюю новий контакт
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
    const newContact = await createContact({
      name,
      email,
      phoneNumber,
      isFavourite,
      contactType,
      userId: req.user._id, // обов'язково userId
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

// PATCH /contacts/:id-для оновлення даних існуючого контакту.
export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

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

// DELETE /contacts/:id — видалити контакт (тільки свій)
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
