import { CafeConfig } from '../core/CafeConfig.js';
import { Drink } from '../menu/Drink.js';
import { MenuItem } from '../menu/MenuItem.js';

// Заказ -- пример композиции: он не наследует позиции меню, а хранит их.
// Класс готов, кроме расчёта скидки -- его нужно переписать в задаче 5.
export class Order {
  static #nextId = 1;

  #id;
  #lines = [];

  discountType = 'none';

  constructor() {
    this.#id = Order.#nextId++;
  }

  get id() {
    return this.#id;
  }

  addItem(item, quantity = 1) {
    if (!(item instanceof MenuItem)) {
      throw new Error('В заказ можно добавить только позицию меню');
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Количество должно быть целым положительным числом');
    }

    const limit = new CafeConfig().get('maxItemsPerOrder');
    if (this.itemsCount + quantity > limit) {
      throw new Error(`В заказе не может быть больше ${limit} позиций`);
    }

    const line = this.#lines.find(l => l.item === item);
    if (line) {
      line.quantity += quantity;
    } else {
      this.#lines.push({ item, quantity });
    }
  }

  removeItem(item) {
    this.#lines = this.#lines.filter(line => line.item !== item);
  }

  getLines() {
    return this.#lines.map(line => ({ ...line }));
  }

  get itemsCount() {
    return this.#lines.reduce((sum, line) => sum + line.quantity, 0);
  }

  get subtotal() {
    return this.#lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  }

  get discount() {
    const config = new CafeConfig();
    let discount = 0;

    if (this.discountType === 'none') {
      discount = 0;
    } else if (this.discountType === 'loyalty') {
      discount = Math.round((this.subtotal * config.get('loyaltyPercent')) / 100);
    } else if (this.discountType === 'happyHour') {
      let drinksSum = 0;
      for (const line of this.#lines) {
        if (line.item instanceof Drink) {
          drinksSum += line.item.price * line.quantity;
        }
      }
      discount = Math.round((drinksSum * config.get('happyHourPercent')) / 100);
    } else if (this.discountType === 'bigOrder') {
      discount = this.itemsCount >= 5 ? 150 : 0;
    } else {
      throw new Error(`Неизвестный тип скидки: ${this.discountType}`);
    }

    // Скидка не может быть больше суммы заказа
    return Math.min(discount, this.subtotal);
  }

  get total() {
    return this.subtotal - this.discount;
  }
}
