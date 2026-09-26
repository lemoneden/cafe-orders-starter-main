// ЗАДАЧА 5. Этот файл и расчёт скидки в Order.js нужно переписать.
// Интерфейс использует только DISCOUNT_OPTIONS и applyDiscount --
// их названия и параметры должны остаться прежними.

export const DISCOUNT_OPTIONS = [
  { value: 'none', label: 'Без скидки' },
  { value: 'loyalty', label: 'Карта лояльности: −10%' },
  { value: 'happyHour', label: 'Счастливые часы: −20% на напитки' },
  { value: 'bigOrder', label: 'Большой заказ: −150 руб. от 5 позиций' },
];

export function applyDiscount(order, value) {
  order.discountType = value;
}
