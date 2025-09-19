/* ЗАВДАННЯ файлу- використання утиліти ctrlWrapper, яка використовується для обгортання контролерів Express. Його основне призначення — автоматично ловити асинхронні помилки в контролерах і передавати їх у middleware для обробки помилок (errorHandler), щоб не писати try/catch в кожному контролері. */

export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next); // Виконати контролер
    } catch (err) {
      next(err); // Передати помилку в middleware обробки помилок
    }
  };
};
