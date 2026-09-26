import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LoyaltyCard } from '../src/loyalty/LoyaltyCard.js';

test('начисление и списание баллов', () => {
  const card = new LoyaltyCard('Анна');
  assert.equal(card.addPoints(1250), 12);
  assert.equal(card.points, 12);

  card.spendPoints(5);
  assert.equal(card.points, 7);
  assert.throws(() => card.spendPoints(100));
  assert.equal(card.points, 7);
});

test('нельзя списать отрицательное или дробное количество', () => {
  const card = new LoyaltyCard('Анна');
  card.addPoints(1000);
  assert.throws(() => card.spendPoints(-100));
  assert.throws(() => card.spendPoints(1.5));
  assert.equal(card.points, 10);
});

test('баллы нельзя изменить напрямую', () => {
  const card = new LoyaltyCard('Анна');
  assert.throws(() => {
    card.points = 99999;
  }, TypeError);
  assert.equal(card.points, 0);
});

test('уровень карты', () => {
  const card = new LoyaltyCard('Анна');
  assert.equal(card.getLevel(), 'Бронза');
  card.addPoints(10000);
  assert.equal(card.getLevel(), 'Серебро');
  card.addPoints(40000);
  assert.equal(card.getLevel(), 'Золото');
});

test('история операций: getHistory возвращает копию', () => {
  const card = new LoyaltyCard('Анна');
  card.addPoints(500);
  card.spendPoints(2);

  const history = card.getHistory();
  assert.deepEqual(history, [
    { type: 'earn', amount: 5 },
    { type: 'spend', amount: 2 },
  ]);

  history.push({ type: 'earn', amount: 1000 });
  history[0].amount = 1000;
  assert.equal(card.getHistory().length, 2);
  assert.equal(card.getHistory()[0].amount, 5);
});

test('методы живут в прототипе, а не в каждом объекте', () => {
  const first = new LoyaltyCard('Анна');
  const second = new LoyaltyCard('Пётр');

  assert.equal(first.addPoints, second.addPoints);
  assert.equal(first.spendPoints, second.spendPoints);
  assert.equal(first.getLevel, second.getLevel);
  assert.deepEqual(Object.keys(first), ['ownerName']);
});
