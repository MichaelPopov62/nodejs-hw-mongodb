/*В файлі створюється функція яка приймає параметри фільтраціі.
Для обробки запиту до БД*/

export function parseFilterParams(query) {
  const filter = {};

  if (query.type) {
    filter.contactType = query.type; // фільтрую за типом контакту
  }

  if (query.isFavourite !== undefined) {
    filter.isFavourite = query.isFavourite === 'true'; // перетворюю рядок у Boolean
  }

  return filter;
}
