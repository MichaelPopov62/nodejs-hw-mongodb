/*код відповідає за ініціалізацію підключення до MongoDB і повідомляє про успіх або помилку підключення.*/

import mongoose from 'mongoose';

const URI = process.env.DB_URI;

export const initMongoConnection = async (URI) => {
  try {
    await mongoose.connect(URI);

    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.log('Error while setting up mongo connection', err);
    throw err;
  }
};
