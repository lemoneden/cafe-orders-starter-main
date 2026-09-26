import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  applyDiscount,
  BigOrderDiscount,
  HappyHourDiscount,
  LoyaltyDiscount,
  NoDiscount,
} from '../src/discounts/index.js';
import { Drink } from '../src/menu/Drink.js';
import { Dessert } from '../src/menu/Dessert.js';
import { Order } from '../src/order/Order.js';

const latte = new Drink('Латте', 200);
const cheesecake = new Dessert('Чизкейк', 250);

// Сумма заказа: 200 * 2 + 250 = 650, напитков на 400
function makeOrder() {
  const order = new Order();
  order.addItem(latte, 2);
  order.addItem(cheesecake, 1);
  return order;
}

test('у каждой стратегии есть метод calculate', () => {
  for (const Strategy of [NoDiscount, LoyaltyDiscount, HappyHourDiscount, BigOrderDiscount]) {
    assert.equal(typeof Strategy.prototype.calculate, 'function');
  }
});

test('стратегии считают скидку', () => {
  const order = makeOrder();
  assert.equal(new NoDiscount().calculate(order), 0);
  assert.equal(new LoyaltyDiscount().calculate(order), 65);
  assert.equal(new HappyHourDiscount().calculate(order), 80);
  assert.equal(new BigOrderDiscount().calculate(order), 0);

  order.addItem(cheesecake, 2);
  assert.equal(new BigOrderDiscount().calculate(order), 150);
});

test('заказ использует стратегию через setDiscount', () => {
  const order = makeOrder();
  assert.equal(order.discount, 0);

  order.setDiscount(new LoyaltyDiscount());
  assert.equal(order.discount, 65);
  assert.equal(order.total, 585);
});

test('новую скидку можно добавить, не меняя Order', () => {
  const order = makeOrder();
  order.setDiscount({ calculate: () => 100 });
  assert.equal(order.total, 550);
});

test('скидка не больше суммы заказа', () => {
  const order = makeOrder();
  order.setDiscount({ calculate: () => 10000 });
  assert.equal(order.total, 0);
});

test('applyDiscount работает по-прежнему', () => {
  const order = makeOrder();
  applyDiscount(order, 'happyHour');
  assert.equal(order.discount, 80);
  applyDiscount(order, 'none');
  assert.equal(order.discount, 0);
  assert.throws(() => applyDiscount(order, 'unknown'));
});

test('в Order.js не осталось цепочки условий по типу скидки', () => {
  const source = readFileSync(new URL('../src/order/Order.js', import.meta.url), 'utf8');
  assert.ok(!source.includes('discountType'), 'в Order.js осталось поле discountType');
  assert.ok(!source.includes('else if'), 'в Order.js осталась цепочка else if');
});
