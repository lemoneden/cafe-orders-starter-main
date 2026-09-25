/**
 * ЗАДАЧА 3.2. Подписчик: счётчик продаж.
 *
 * createSalesCounter(orderService) подписывается на события сервиса
 * и считает, сколько штук каждой позиции продано. Ключ -- item.name.
 *
 * - 'orderCreated'  -- прибавить количество по каждой строке заказа;
 * - 'statusChanged' со статусом 'cancelled' -- вычесть их обратно.
 *
 * Возвращает объект:
 *   getCount(name)    сколько продано позиции (0, если не продавалась);
 *   getTop(limit = 3) массив { name, count }, отсортированный по убыванию count;
 *   unsubscribe()     отписаться от обоих событий.
 *
 * Подсказка: on() у EventEmitter возвращает функцию отписки.
 */
export function createSalesCounter(orderService) {
  throw new Error('Задача 3: createSalesCounter ещё не реализован');
}
