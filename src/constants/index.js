//Файл де створена константа sortOrder для параметрів запиту при сортуванні

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000; //Використовується для accessTokenValidUntil.
export const ONE_DAY = 24 * 60 * 60 * 1000; //Це базова одиниця, щоб потім легше було множити.
export const THIRTY_DAYS = 30 * ONE_DAY; // refreshToken живе 30 днів

export const SIXTY_MINUTES = 60 * 60 * 1000; // 60 хвилин у мс//для тестування accessTokenValidUntil.
