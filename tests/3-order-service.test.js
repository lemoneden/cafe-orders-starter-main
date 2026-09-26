import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from '../src/core/EventEmitter.js';
import { Logger } from '../src/core/Logger.js';
import { Drink } from '../src/menu/Drink.js';
import { Dessert } from '../src/menu/Dessert.js';
import { Order } from '../src/order/Order.js';
import { OrderService } from '../src/order/OrderService.js';
import { createSalesCounter } from '../src/services/salesCounter.js';

const latte = new Drink('Латте', 200);
const cheesecake = new Dessert('Чизкейк', 250);

function makeOrder(...lines) {
  const order = new Order();
  lines.forEach(([item, quantity]) => order.addItem(item, quantity));
  return order;
}

test('OrderService наследует EventEmitter и использует миксин Logger', () => {
  assert.ok(new OrderService() instanceof EventEmitter);
  assert.equal(OrderService.prototype.log, Logger.log);
});

test('createOrder сохраняет заказ со статусом new и отправляет orderCreated', t => {
  t.mock.method(console, 'log', () => {});
  const service = new OrderService();
  const order = makeOrder([latte, 1]);
  const received = [];
  service.on('orderCreated', data => received.push(data));

  service.createOrder(order);

  assert.equal(service.getStatus(order.id), 'new');
  assert.equal(received.length, 1);
  assert.equal(received[0].order, order);
});

test('createOrder пишет в лог', t => {
  const logMock = t.mock.method(console, 'log', () => {});
  new OrderService().createOrder(makeOrder([latte, 1]));
  assert.ok(logMock.mock.callCount() >= 1);
});

test('createOrder проверяет заказ', t => {
  t.mock.method(console, 'log', () => {});
  const service = new OrderService();
  const order = makeOrder([latte, 1]);

  assert.throws(() => service.createOrder({ id: 1 }));
  assert.throws(() => service.createOrder(new Order()));
  service.createOrder(order);
  assert.throws(() => service.createOrder(order));
});

test('changeStatus переводит заказ и отправляет statusChanged', t => {
  t.mock.method(console, 'log', () => {});
  const service = new OrderService();
  const order = makeOrder([latte, 1]);
  const received = [];
  service.on('statusChanged', data => received.push(data));

  service.createOrder(order);
  service.changeStatus(order.id, 'preparing');

  assert.equal(service.getStatus(order.id), 'preparing');
  assert.deepEqual(received, [{ order, from: 'new', to: 'preparing' }]);
});

test('недопустимый переход вызывает ошибку и не меняет статус', t => {
  t.mock.method(console, 'log', () => {});
  const service = new OrderService();
  const order = makeOrder([latte, 1]);
  service.createOrder(order);

  assert.throws(() => service.changeStatus(order.id, 'done'));
  assert.equal(service.getStatus(order.id), 'new');
});

test('неизвестный заказ', t => {
  t.mock.method(console, 'log', () => {});
  const service = new OrderService();
  assert.equal(service.getStatus(999), null);
  assert.throws(() => service.changeStatus(999, 'preparing'));
});

test('getOrders возвращает копию', t => {
  t.mock.method(console, 'log', () => {});
  const service = new OrderService();
  const order = makeOrder([latte, 1]);
  service.createOrder(order);

  const orders = service.getOrders();
  assert.equal(orders.length, 1);
  assert.equal(orders[0].order, order);
  assert.equal(orders[0].status, 'new');

  orders.push({ order: makeOrder([latte, 1]), status: 'new' });
  assert.equal(service.getOrders().length, 1);
});

test('счётчик продаж считает позиции и учитывает отмену', t => {
  t.mock.method(console, 'log', () => {});
  const service = new OrderService();
  const sales = createSalesCounter(service);

  const first = makeOrder([latte, 2], [cheesecake, 1]);
  const second = makeOrder([latte, 1]);
  service.createOrder(first);
  service.createOrder(second);

  assert.equal(sales.getCount('Латте'), 3);
  assert.equal(sales.getCount('Чизкейк'), 1);
  assert.equal(sales.getCount('Круассан'), 0);

  service.changeStatus(second.id, 'cancelled');
  assert.equal(sales.getCount('Латте'), 2);
});

test('getTop сортирует по убыванию и учитывает limit', t => {
  t.mock.method(console, 'log', () => {});
  const service = new OrderService();
  const sales = createSalesCounter(service);
  const croissant = new Dessert('Круассан', 150);

  service.createOrder(makeOrder([latte, 3], [cheesecake, 1], [croissant, 2]));

  assert.deepEqual(sales.getTop(2), [
    { name: 'Латте', count: 3 },
    { name: 'Круассан', count: 2 },
  ]);
  assert.equal(sales.getTop().length, 3);
});

test('после unsubscribe счётчик не меняется', t => {
  t.mock.method(console, 'log', () => {});
  const service = new OrderService();
  const sales = createSalesCounter(service);

  service.createOrder(makeOrder([latte, 1]));
  sales.unsubscribe();
  service.createOrder(makeOrder([latte, 5]));

  assert.equal(sales.getCount('Латте'), 1);
});
