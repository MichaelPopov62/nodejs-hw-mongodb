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
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

// Отримую всі контакти
export const getContactsController = async (req, res) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query); // отримую параметри пагінаціі
    const { sortBy, sortOrder } = parseSortParams(req.query); //отримую параметри сортування
    const filter = parseFilterParams(
      req.query,
    ); /*функція  перетворює query-параметри type та isFavourite у об'єкт для MongoDB. ( filter.contactType = 'work') фільтрація по типу контакту
    (filter.isFavourite = true/false )фільтрація по обраному контакту*/
    console.log('Filter params:', filter);

    const result = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: result,
    });
  } catch (err) {
    console.error(err); // лог помилки у консоль
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

// Отримую контакт по id
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// Створюю новий контакт
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
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    console.error('Create contact error:', error);
    next(error); // передаємо помилку в errorHandler
  }
};

// оновлюю дані існуючого контакту.
export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await updateContact(contactId, req.body);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `"Successfully patched a contact!"`,
    data: contact,
  });
};

// Видаляю контакт
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send(); //використовую метод об'єкта res для відправки відповіді з кодом 204 No Content, що означає успішне видалення ресурсу без повернення вмісту.
};
