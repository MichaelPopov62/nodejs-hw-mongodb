/* Призначення файлу:
налаштування middleware для завантаження файлів у пам'ять.
Використовується бібліотека multer для обробки multipart/form-data.
Файли зберігаються в оперативній пам'яті (memoryStorage).
Експортується middleware `upload` для використання у роутерах (наприклад, для завантаження фото контактів).*/

import multer from 'multer';

// Використовуваня пам'яті для зберігання файлів (не зберігає на диск)
const storage = multer.memoryStorage(); // файл буде у пам'яті

/*Middleware для завантаження файлів
Використовується у роутерах: upload.single('photo')*/
export const upload = multer({ storage });
