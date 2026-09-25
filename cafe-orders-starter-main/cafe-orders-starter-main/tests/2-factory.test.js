import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MenuFactory } from '../src/menu/MenuFactory.js';
import { Drink } from '../src/menu/Drink.js';
import { Dessert } from '../src/menu/Dessert.js';
import { menuData } from '../src/data/menu.js';

test('create создаёт напиток', () => {
  const drink = MenuFactory.create('drink', { name: 'Латте', price: 200, size: 'L' });
  assert.ok(drink instanceof Drink);
  assert.equal(drink.price, 260);
});

test('create создаёт десерт', () => {
  const dessert = MenuFactory.create('dessert', { name: 'Брауни', price: 220, isVegan: true });
  assert.ok(dessert instanceof Dessert);
  assert.equal(dessert.isVegan, true);
});

test('неизвестный тип вызывает ошибку с понятным текстом', () => {
  assert.throws(() => MenuFactory.create('pizza', { name: 'Пицца', price: 500 }), {
    message: 'Неизвестный тип позиции: pizza',
  });
});

test('ошибки валидации из классов не теряются', () => {
  assert.throws(() => MenuFactory.create('drink', { name: '', price: 200 }));
});

test('createMenu собирает всё меню', () => {
  const menu = MenuFactory.createMenu(menuData);
  assert.equal(menu.length, menuData.length);
  assert.ok(menu.every(item => item instanceof Drink || item instanceof Dessert));
  assert.equal(menu[0].describe(), 'Эспрессо (S) — 96 руб.');
});
