/*ЗАВДАННЯ коду-обробляти HTTP-запити, взаємодіяти із сервісним шаром (services/contacts.js) та формувати відповіді для клієнта.
createHttpError для генерації HTTP-помилок та взаємодіє з сервісами, які містять логіку роботи з базою даних*/

import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';

// Отримую всі контакти
export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
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
export const createContactController = async (req, res) => {
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
