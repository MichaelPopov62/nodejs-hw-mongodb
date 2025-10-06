/*Файл обчислює дані для пагінації .
Функція  calculatePaginationData формує частину відповіді, яка описує поточну сторінку та навігацію між сторінками.*/

// Функція для обчислення даних пагінації
export const calculatePaginationData = (count, perPage, page) => {
  // Розраховую загальну кількість сторінок
  const totalPages = Math.ceil(count / perPage);
  /* Визначаю, чи є наступна сторінка
     (true, якщо поточна сторінка менша за totalPages) */
  const hasNextPage = page < totalPages;
  /* Визначаю, чи є попередня сторінка
     (true, якщо поточна сторінка більша за 1)*/
  const hasPreviousPage = page > 1;
  // Повертаю об'єкт з усіма даними пагінації
  return {
    page, //поточна сторінка
    perPage, // кількість елементів на сторінці
    totalItems: count, // загальна кількість елементів
    totalPages, // загальна кількість сторінок
    hasNextPage, // чи є наступна сторінка
    hasPreviousPage, // чи є попередня сторінка
  };
};
