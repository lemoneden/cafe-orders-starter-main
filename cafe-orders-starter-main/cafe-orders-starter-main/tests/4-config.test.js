import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CafeConfig } from '../src/core/CafeConfig.js';

test('CafeConfig -- одиночка', () => {
  assert.equal(new CafeConfig(), new CafeConfig());
});

test('изменения видны из любого места', () => {
  const a = new CafeConfig();
  const b = new CafeConfig();
  a.set('maxItemsPerOrder', 3);
  assert.equal(b.get('maxItemsPerOrder'), 3);
  a.set('maxItemsPerOrder', 10);
});

test('неизвестный параметр вызывает ошибку', () => {
  assert.throws(() => new CafeConfig().set('discount', 50));
});

test('настройки закрыты от прямого изменения', () => {
  const config = new CafeConfig();
  assert.equal(config.settings, undefined);
  assert.deepEqual(Object.keys(config), []);
});

test('getAll возвращает копию', () => {
  const config = new CafeConfig();
  const all = config.getAll();
  assert.equal(all.cafeName, 'Кофейня «Зерно»');
  all.cafeName = 'Другая кофейня';
  assert.equal(config.get('cafeName'), 'Кофейня «Зерно»');
});
