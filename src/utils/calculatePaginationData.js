/*Файл обчислює дані для пагінації .
Функція  calculatePaginationData формує частину відповіді, яка описує поточну сторінку та навігацію між сторінками.*/

// Функція для обчислення даних пагінації
export const calculatePaginationData = (count, perPage, page) => {
  // Розраховуємо загальну кількість сторінок
  const totalPages = Math.ceil(count / perPage);
  /* Визначаємо, чи є наступна сторінка
   (true, якщо поточна сторінка > 1 і є хоча б одна сторінка)*/
  const hasNextPage = page < totalPages;
  /* Визначаємо, чи є попередня сторінка
   (true, якщо поточна сторінка менша за totalPages)*/
  const hasPreviousPage = page > 1;
  // Повертаємо об'єкт з усіма даними пагінації
  return {
    page, //поточна сторінка
    perPage, // кількість елементів на сторінці
    totalItems: count, // загальна кількість елементів
    totalPages, // загальна кількість сторінок
    hasNextPage, // чи є наступна сторінка
    hasPreviousPage, // чи є попередня сторінка
  };
};
