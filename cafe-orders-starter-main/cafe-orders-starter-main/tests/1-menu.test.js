import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MenuItem } from '../src/menu/MenuItem.js';
import { Drink } from '../src/menu/Drink.js';
import { Dessert } from '../src/menu/Dessert.js';

test('MenuItem нельзя создать напрямую', () => {
  assert.throws(() => new MenuItem('Кофе', 100));
});

test('Drink и Dessert наследуют MenuItem', () => {
  assert.ok(new Drink('Латте', 200) instanceof MenuItem);
  assert.ok(new Dessert('Чизкейк', 250) instanceof MenuItem);
});

test('имя обрезается от пробелов', () => {
  assert.equal(new Drink('  Латте  ', 200).name, 'Латте');
});

test('невалидное имя вызывает ошибку', () => {
  assert.throws(() => new Drink('', 200));
  assert.throws(() => new Drink('   ', 200));
  assert.throws(() => new Drink(123, 200));
});

test('невалидная цена вызывает ошибку', () => {
  assert.throws(() => new Drink('Латте', 0));
  assert.throws(() => new Drink('Латте', -5));
  assert.throws(() => new Drink('Латте', '200'));
  assert.throws(() => new Drink('Латте', NaN));
});

test('сеттеры проверяют значения и после создания', () => {
  const drink = new Drink('Латте', 200);
  drink.name = 'Раф';
  drink.basePrice = 230;
  assert.equal(drink.name, 'Раф');
  assert.equal(drink.basePrice, 230);
  assert.throws(() => {
    drink.basePrice = -1;
  });
  assert.equal(drink.basePrice, 230);
});

test('цена напитка зависит от размера', () => {
  assert.equal(new Drink('Латте', 200, 'S').price, 160);
  assert.equal(new Drink('Латте', 200).price, 200);
  assert.equal(new Drink('Латте', 200, 'L').price, 260);
  assert.equal(new Drink('Раф', 230, 'L').price, 299);
});

test('размер напитка проверяется', () => {
  assert.throws(() => new Drink('Латте', 200, 'XL'));

  const drink = new Drink('Латте', 200);
  drink.size = 'L';
  assert.equal(drink.size, 'L');
  assert.equal(drink.price, 260);
  assert.throws(() => {
    drink.size = 'XXL';
  });
});

test('isVegan доступен только для чтения', () => {
  const dessert = new Dessert('Брауни', 220, true);
  assert.equal(dessert.isVegan, true);
  assert.equal(new Dessert('Чизкейк', 250).isVegan, false);
  assert.throws(() => {
    dessert.isVegan = false;
  }, TypeError);
});

test('getCategory', () => {
  assert.equal(new Drink('Латте', 200).getCategory(), 'Напитки');
  assert.equal(new Dessert('Чизкейк', 250).getCategory(), 'Десерты');
});

test('подкласс без getCategory вызывает ошибку', () => {
  class Tea extends MenuItem {}
  assert.throws(() => new Tea('Чай', 100).getCategory());
});

test('describe', () => {
  assert.equal(new Drink('Латте', 200).describe(), 'Латте (M) — 200 руб.');
  assert.equal(new Dessert('Чизкейк', 250).describe(), 'Чизкейк — 250 руб.');
  assert.equal(new Dessert('Брауни', 220, true).describe(), 'Брауни (веган) — 220 руб.');
});

test('данные хранятся в приватных полях', () => {
  assert.deepEqual(Object.keys(new Drink('Латте', 200)), []);
  assert.deepEqual(Object.keys(new Dessert('Брауни', 220, true)), []);
});
