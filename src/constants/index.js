//Файл де створена константа sortOrder для параметрів запиту при сортуванні

//Задаю порядок сортування для запитів
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000; //Час життя accessToken (15 хв у мс).Використовується для accessTokenValidUntil.

export const ONE_DAY = 24 * 60 * 60 * 1000; //Базова одиниця часу (1 день у мс).

export const THIRTY_DAYS = 30 * ONE_DAY; // Час життя refreshToken (30 днів у мс).

export const SIXTY_MINUTES = 60 * 60 * 1000; // 60 хвилин у мс//для тестування accessTokenValidUntil.

//Конфігурація для підключення до хмарного сервісу Cloudinary (ім'я хмари, ключ, секрет).
export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME', //ім'я хмари
  API_KEY: 'API_KEY', //ключ
  API_SECRET: 'API_SECRET', //секретний ключ
};
