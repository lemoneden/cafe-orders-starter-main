import { EventEmitter } from '../core/EventEmitter.js'
import { Logger } from '../core/Logger.js'
import { Order } from './Order.js'
import { TRANSITIONS, ORDER_STATUS_LABELS } from './statuses.js'

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
  #orders = new Map()

  //   Map {
  //   1 => Order { #id: 1, #lines: [...] },
  //   2 => Order { #id: 2, #lines: [...] },
  //   3 => Order { #id: 3, #lines: [...] }
  //    }

  createOrder(order) {
    if (!(order instanceof Order)) {
      throw new Error('order должен быть экземпляром Order')
    }

    if (order.itemsCount === 0) {
      throw new Error('Пустой заказ оформить нельзя')
    }

    if (this.#orders.has(order.id)) {
      throw new Error('Такой заказ уже оформлен')
    }

    this.#orders.set(order.id, { order, status: 'new' })

    this.emit('orderCreated', { order })

    this.log(`Создан заказ: ${order.id}`)
  }

  changeStatus(orderId, nextStatus) {
    if (!this.#orders.has(orderId)) {
      throw new Error(`Неизвестный заказ: ${orderId}`)
    }

    const entry = this.#orders.get(orderId)
    const currentStatus = entry.status

    if (!TRANSITIONS[currentStatus].includes(nextStatus)) {
      throw new Error(`Переход ${currentStatus} в ${nextStatus} невозможен`)
    }

    entry.status = nextStatus

    this.emit('statusChanged', {
      order: entry.order,
      from: currentStatus,
      to: nextStatus,
    })

    this.log(`Заказ ${orderId} переходит в ${nextStatus}`)
  }

  // ? - безопасное обращение к свойству или методу, не рискуя получить TypeError
  // если вернет undefined - сработает ?? и вернет null
  getStatus(orderId) {
    return this.#orders.get(orderId)?.status ?? null
  }

  getOrders() {
    // копия #orders но с другой ссылкой
    // исходный #orders не изменяется, если изменить этот
    return [...this.#orders.values()].map(({ order, status }) => ({
      order,
      status,
    }))
  }
}

Object.assign(OrderService.prototype, Logger)
