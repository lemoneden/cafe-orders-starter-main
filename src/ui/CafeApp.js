import { CafeConfig } from '../core/CafeConfig.js';
import { menuData } from '../data/menu.js';
import { applyDiscount, DISCOUNT_OPTIONS } from '../discounts/index.js';
import { LoyaltyCard } from '../loyalty/LoyaltyCard.js';
import { MenuFactory } from '../menu/MenuFactory.js';
import { Order } from '../order/Order.js';
import { OrderService } from '../order/OrderService.js';
import { NEXT_STATUS, ORDER_STATUS_LABELS, TRANSITIONS } from '../order/statuses.js';
import { ReceiptPrinter } from '../receipt/ReceiptPrinter.js';
import { createSalesCounter } from '../services/salesCounter.js';

// Интерфейс кассы. В этом файле одна ошибка -- задача 8.
export class CafeApp {
  constructor(root) {
    this.root = root;
    this.config = new CafeConfig();
    this.service = new OrderService();
    this.printer = new ReceiptPrinter();
    this.card = new LoyaltyCard('Гость');
    this.menu = MenuFactory.createMenu(menuData);
    this.sales = createSalesCounter(this.service);
    this.order = new Order();
    this.events = [];
    this.receipt = '';
  }

  init() {
    this.root.innerHTML = `
      <header class="header">
        <h1>${this.config.get('cafeName')}</h1>
        <label class="limit">
          Лимит позиций в заказе
          <input type="number" min="1" max="50" value="${this.config.get('maxItemsPerOrder')}" data-limit />
        </label>
      </header>
      <p class="message" data-message></p>
      <div class="layout">
        <section class="panel">
          <h2>Меню</h2>
          <ul class="list" data-menu></ul>
        </section>
        <section class="panel">
          <h2>Текущий заказ</h2>
          <ul class="list" data-order-lines></ul>
          <label class="field">
            Скидка
            <select data-discount>
              ${DISCOUNT_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
            </select>
          </label>
          <div data-totals></div>
          <button type="button" class="button button--primary" data-checkout>Оформить заказ</button>
          <h2>Заказы</h2>
          <ul class="list" data-orders></ul>
        </section>
        <section class="panel">
          <h2>Карта гостя</h2>
          <div data-card></div>
          <h2>Популярное</h2>
          <ol data-top></ol>
          <h2>Последний чек</h2>
          <pre class="receipt" data-receipt></pre>
          <h2>События</h2>
          <ul class="events" data-events></ul>
        </section>
      </div>
    `;

    this.menuList = this.root.querySelector('[data-menu]');
    this.orderLines = this.root.querySelector('[data-order-lines]');
    this.discountSelect = this.root.querySelector('[data-discount]');
    this.totals = this.root.querySelector('[data-totals]');
    this.checkoutButton = this.root.querySelector('[data-checkout]');
    this.ordersList = this.root.querySelector('[data-orders]');
    this.limitInput = this.root.querySelector('[data-limit]');
    this.message = this.root.querySelector('[data-message]');

    this.menuList.addEventListener('click', this.handleMenuClick);
    this.orderLines.addEventListener('click', event => this.handleOrderLineClick(event));
    this.discountSelect.addEventListener('change', event => this.handleDiscountChange(event));
    this.checkoutButton.addEventListener('click', () => this.handleCheckout());
    this.ordersList.addEventListener('click', event => this.handleStatusClick(event));
    this.limitInput.addEventListener('change', event => this.handleLimitChange(event));

    this.service.on('orderCreated', ({ order }) => {
      this.addEvent(`Заказ #${order.id} оформлен на ${order.total} руб.`);
    });
    this.service.on('statusChanged', ({ order, to }) => {
      this.addEvent(`Заказ #${order.id}: ${ORDER_STATUS_LABELS[to].toLowerCase()}`);
    });

    this.renderMenu();
    this.renderOrder();
    this.renderOrders();
    this.renderSidebar();
  }

  // ---------- обработчики ----------

  handleMenuClick(event) {
    const button = event.target.closest('[data-add]');
    if (!button) return;

    const item = this.menu[Number(button.dataset.add)];
    this.run(() => this.order.addItem(item));
    this.renderOrder();
  }

  handleOrderLineClick(event) {
    const button = event.target.closest('[data-remove]');
    if (!button) return;

    const { item } = this.order.getLines()[Number(button.dataset.remove)];
    this.order.removeItem(item);
    this.renderOrder();
  }

  handleDiscountChange(event) {
    this.run(() => applyDiscount(this.order, event.target.value));
    this.renderOrder();
  }

  handleCheckout() {
    const order = this.order;
    const isCreated = this.run(() => this.service.createOrder(order));
    if (!isCreated) return;

    const earned = this.card.addPoints(order.total);
    this.receipt = this.printer.print(order);
    this.showMessage(`Заказ #${order.id} оформлен. Начислено баллов: ${earned}`);

    this.order = new Order();
    this.discountSelect.value = 'none';

    this.renderOrder();
    this.renderOrders();
    this.renderSidebar();
  }

  handleStatusClick(event) {
    const button = event.target.closest('[data-status]');
    if (!button) return;

    const orderId = Number(button.dataset.orderId);
    this.run(() => this.service.changeStatus(orderId, button.dataset.status));
    this.renderOrders();
    this.renderSidebar();
  }

  handleLimitChange(event) {
    const limit = Number(event.target.value);
    this.run(() => this.config.set('maxItemsPerOrder', limit));
    this.showMessage(`Лимит позиций в заказе: ${limit}`);
  }

  // ---------- отрисовка ----------

  renderMenu() {
    this.menuList.innerHTML = this.menu
      .map(
        (item, index) => `
          <li class="row">
            <span>
              ${item.describe()}
              <small class="muted">${item.getCategory()}</small>
            </span>
            <button type="button" class="button" data-add="${index}">Добавить</button>
          </li>
        `
      )
      .join('');
  }

  renderOrder() {
    const lines = this.order.getLines();

    this.orderLines.innerHTML = lines.length
      ? lines
          .map(
            ({ item, quantity }, index) => `
              <li class="row">
                <span>${item.describe()} × ${quantity}</span>
                <button type="button" class="button" data-remove="${index}">Убрать</button>
              </li>
            `
          )
          .join('')
      : '<li class="muted">Добавьте позиции из меню</li>';

    this.totals.innerHTML = `
      <p>Позиций: ${this.order.itemsCount}</p>
      <p>Сумма: ${this.order.subtotal} руб.</p>
      <p>Скидка: ${this.order.discount} руб.</p>
      <p><strong>Итого: ${this.order.total} руб.</strong></p>
    `;
    this.checkoutButton.disabled = lines.length === 0;
  }

  renderOrders() {
    const orders = this.service.getOrders();

    this.ordersList.innerHTML = orders.length
      ? orders
          .map(({ order, status }) => {
            const next = NEXT_STATUS[status];
            const canCancel = TRANSITIONS[status].includes('cancelled');
            return `
              <li class="row">
                <span>
                  #${order.id}, ${order.total} руб.
                  <small class="muted">${ORDER_STATUS_LABELS[status]}</small>
                </span>
                <span class="actions">
                  ${next ? `<button type="button" class="button" data-order-id="${order.id}" data-status="${next}">${ORDER_STATUS_LABELS[next]}</button>` : ''}
                  ${canCancel ? `<button type="button" class="button" data-order-id="${order.id}" data-status="cancelled">Отменить</button>` : ''}
                </span>
              </li>
            `;
          })
          .join('')
      : '<li class="muted">Заказов пока нет</li>';
  }

  renderSidebar() {
    this.root.querySelector('[data-card]').innerHTML = `
      <p>${this.card.ownerName}: ${this.card.points} баллов</p>
      <p>Уровень: ${this.card.getLevel()}</p>
    `;

    const top = this.sales.getTop(3);
    this.root.querySelector('[data-top]').innerHTML = top.length
      ? top.map(({ name, count }) => `<li>${name}: ${count} шт.</li>`).join('')
      : '<li class="muted">Продаж пока нет</li>';

    this.root.querySelector('[data-receipt]').textContent = this.receipt || 'Чеков пока нет';

    this.root.querySelector('[data-events]').innerHTML = this.events
      .map(text => `<li>${text}</li>`)
      .join('');
  }

  // ---------- вспомогательные ----------

  addEvent(text) {
    const time = new Date().toLocaleTimeString('ru-RU');
    this.events = [`${time} ${text}`, ...this.events].slice(0, 8);
    this.renderSidebar();
  }

  showMessage(text, isError = false) {
    this.message.textContent = text;
    this.message.classList.toggle('message--error', isError);
  }

  // Выполняет действие и показывает ошибку, если она возникла.
  // Возвращает true, если всё прошло успешно.
  run(action) {
    try {
      action();
      this.showMessage('');
      return true;
    } catch (error) {
      this.showMessage(error.message, true);
      return false;
    }
  }
}
