/*файл служить для обробки параметрів пагінації, які приходять у запитах.*/

// Функція безпечного перетворення рядка у число
const parseNumber = (number, defaultValue) => {
  // Перевіряю, чи number є рядком
  const isString = typeof number === 'string';
  if (!isString) return defaultValue; // Якщо не рядок — повертаю дефолтне значення

  // Перетворюю рядок у ціле число
  const parsedNumber = parseInt(number);
  // Якщо результат не число (NaN) — повертаю дефолтне значення
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }
  // Якщо все добре — повертаю число
  return parsedNumber;
};

//функція для обробки параметрів пагінації з запиту
export const parsePaginationParams = (query) => {
  // Отримую page та perPage з об'єкта query
  const { page, perPage } = query;

  // Використовую parseNumber для безпечного перетворення
  // Встановлюю дефолтні значення: page = 1, perPage = 10. Додатково гарантую, що числа >= 1
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  // Повертаю об'єкт з коректними параметрами пагінації
  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
