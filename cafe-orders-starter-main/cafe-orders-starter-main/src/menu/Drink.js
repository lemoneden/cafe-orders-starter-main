import { MenuItem } from './MenuItem.js';

/**
 * ЗАДАЧА 1. Напиток.
 *
 * constructor(name, basePrice, size = 'M')
 *
 * size      геттер и сеттер, приватное поле. Допустимые значения: 'S', 'M', 'L'.
 *           Иначе -- Error.
 * price     переопределённый геттер: basePrice, умноженный на коэффициент
 *           размера из SIZE_MULTIPLIERS, округлённый через Math.round.
 * getCategory()  возвращает 'Напитки'.
 * describe()     возвращает строку вида «Латте (M) — 200 руб.»
 */
export const SIZE_MULTIPLIERS = { S: 0.8, M: 1, L: 1.3 };

export class Drink extends MenuItem {
  constructor(name, basePrice, size = 'M') {
    super(name, basePrice);
  }
}
