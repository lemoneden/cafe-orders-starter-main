// Готовый файл. Менять не нужно.

export const ORDER_STATUS_LABELS = {
  new: 'Новый',
  preparing: 'Готовится',
  ready: 'Готов',
  done: 'Выдан',
  cancelled: 'Отменён',
};

// Куда можно перевести заказ из каждого статуса
export const TRANSITIONS = {
  new: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['done'],
  done: [],
  cancelled: [],
};

// Следующий шаг «по кнопке» в интерфейсе
export const NEXT_STATUS = {
  new: 'preparing',
  preparing: 'ready',
  ready: 'done',
};
