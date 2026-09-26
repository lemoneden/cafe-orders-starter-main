import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MenuItem } from '../src/menu/MenuItem.js';
import { Drink } from '../src/menu/Drink.js';
import { Dessert } from '../src/menu/Dessert.js';
import { Order } from '../src/order/Order.js';
import { ReceiptPrinter } from '../src/receipt/ReceiptPrinter.js';

test('displayName у позиций меню', () => {
  assert.equal(new Drink('Латте', 200).displayName, 'Латте (M)');
  assert.equal(new Dessert('Брауни', 220, true).displayName, 'Брауни (веган)');
  assert.equal(new Dessert('Чизкейк', 250).displayName, 'Чизкейк');
});

test('чек печатается в прежнем формате', () => {
  const order = new Order();
  order.addItem(new Drink('Латте', 200), 2);
  order.addItem(new Dessert('Брауни', 220, true), 1);

  const expected = [
    'Кофейня «Зерно»',
    `Заказ #${order.id}`,
    '------------------------',
    'Латте (M) x2 = 400 руб.',
    'Брауни (веган) x1 = 220 руб.',
    '------------------------',
    'Сумма: 620 руб.',
    'Скидка: 0 руб.',
    'Итого: 620 руб.',
  ].join('\n');

  assert.equal(new ReceiptPrinter().print(order), expected);
});

test('новый вид позиции печатается без правок ReceiptPrinter', () => {
  class Tea extends MenuItem {
    getCategory() {
      return 'Чай';
    }

    get displayName() {
      return `${this.name} (заварочный чайник)`;
    }
  }

  const order = new Order();
  order.addItem(new Tea('Пуэр', 300), 1);

  assert.ok(new ReceiptPrinter().print(order).includes('Пуэр (заварочный чайник) x1 = 300 руб.'));
});

test('в ReceiptPrinter нет проверок instanceof', () => {
  const source = readFileSync(new URL('../src/receipt/ReceiptPrinter.js', import.meta.url), 'utf8');
  assert.ok(!source.includes('instanceof'));
});
