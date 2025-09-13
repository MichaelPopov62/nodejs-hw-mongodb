/*Модель Contact для колекції контактів у MongoDB.
Визначає структуру документів контактів у базі даних.
 Забезпечує типізацію полів і валідацію перед збереженням.
 Автоматично додає timestamps (createdAt, updatedAt).*/

import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

//описую схему моделі контактів
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
  },
  {
    timestamps: true, //  автоматично додає createdAt і updatedAt
    versionKey: false, // автоматично прибирає versionKey (__v)тобто версію документа
  },
);
//Створює модель Contact, яка зв'язана з колекцією contacts у MongoDB,
export const Contact = model('Contact', contactSchema);
