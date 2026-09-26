import { EventEmitter } from '../core/EventEmitter.js';
import { Logger } from '../core/Logger.js';
import { Order } from './Order.js';
import { TRANSITIONS, ORDER_STATUS_LABELS } from './statuses.js';

/**
 * ЗАДАЧА 3.1. Сервис заказов.
 *
 * Класс наследует EventEmitter, а к его прототипу подключён миксин Logger
 * (строка подключения уже есть внизу файла).
 *
 * Заказы хранятся в приватном поле. Структуру выберите сами,
 * удобно использовать Map: id заказа -> { order, status }.
 *
 * createOrder(order)
 *   - order должен быть экземпляром Order, иначе Error;
 *   - пустой заказ (itemsCount === 0) оформить нельзя -- Error;
 *   - один и тот же заказ нельзя оформить дважды -- Error;
 *   - статус нового заказа -- 'new';
 *   - генерирует событие 'orderCreated' с данными { order };
 *   - пишет в лог через this.log(...).
 *
 * changeStatus(orderId, nextStatus)
 *   - неизвестный заказ -- Error;
 *   - переход, которого нет в TRANSITIONS, -- Error, статус не меняется;
 *   - генерирует 'statusChanged' с данными { order, from, to };
 *   - пишет в лог.
 *
 * getStatus(orderId)  статус заказа или null, если заказа нет.
 * getOrders()         массив объектов { order, status }.
 *                     Изменение этого массива не должно влиять на сервис.
 */
export class OrderService extends EventEmitter {
  createOrder(order) {
    throw new Error('Задача 3: OrderService.createOrder ещё не реализован');
  }

  changeStatus(orderId, nextStatus) {
    throw new Error('Задача 3: OrderService.changeStatus ещё не реализован');
  }

  getStatus(orderId) {
    throw new Error('Задача 3: OrderService.getStatus ещё не реализован');
  }

  getOrders() {
    throw new Error('Задача 3: OrderService.getOrders ещё не реализован');
  }
}

Object.assign(OrderService.prototype, Logger);
