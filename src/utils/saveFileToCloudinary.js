/* сервіс для завантаження файлів на Cloudinary.*/

import cloudinary from 'cloudinary';
import dotenv from 'dotenv';


dotenv.config();

//Налаштування Cloudinary
cloudinary.v2.config({
  secure: true, // HTTPS
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Функція завантаження файлу на Cloudinary
export async function saveFileToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
}

