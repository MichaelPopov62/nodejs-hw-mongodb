/* Файл парсить параметри сортування з query для GET /contacts.
  1. sortOrder: 'asc' або 'desc' (дефолт — 'asc')
  2. sortBy:не роблю парсінг з query, оскільки умова завдання строго вимагає сортувати , інші значення ігноруються згідно вимог завдання*/

import { SORT_ORDER } from '../constants/index.js';

//визначаю порядок сортування
const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
};

//інтегрую об'єкт query з якого беру значення sortOrder, sortBy
export const parseSortParams = (query) => {
  const { sortOrder } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortOrder: parsedSortOrder,
    sortBy: 'name', // завжди сортуєю по імені контакту згідно завдання
  };
};
