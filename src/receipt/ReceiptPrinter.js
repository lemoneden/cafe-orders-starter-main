import { CafeConfig } from '../core/CafeConfig.js';
import { Dessert } from '../menu/Dessert.js';
import { Drink } from '../menu/Drink.js';

// ЗАДАЧА 6. Код работает, но его нужно переписать. Подробности в TASK.md.

const SEPARATOR = '------------------------';

export class ReceiptPrinter {
  print(order) {
    const config = new CafeConfig();

    const lines = order.getLines().map(({ item, quantity }) => {
      let title;

      if (item instanceof Drink) {
        title = `${item.name} (${item.size})`;
      } else if (item instanceof Dessert) {
        title = item.isVegan ? `${item.name} (веган)` : item.name;
      } else {
        title = item.name;
      }

      return `${title} x${quantity} = ${item.price * quantity} руб.`;
    });

    return [
      config.get('cafeName'),
      `Заказ #${order.id}`,
      SEPARATOR,
      ...lines,
      SEPARATOR,
      `Сумма: ${order.subtotal} руб.`,
      `Скидка: ${order.discount} руб.`,
      `Итого: ${order.total} руб.`,
    ].join('\n');
  }
}
