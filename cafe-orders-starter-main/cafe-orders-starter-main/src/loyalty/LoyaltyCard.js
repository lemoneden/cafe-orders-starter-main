// ЗАДАЧА 7. Код работает, но его нужно переписать. Подробности в TASK.md.
// Публичные методы addPoints, spendPoints, getLevel должны остаться.

export class LoyaltyCard {
  constructor(ownerName) {
    this.ownerName = ownerName;
    this.points = 0;
    this.history = [];

    // 1 балл за каждые полные 100 руб. заказа
    this.addPoints = function (orderTotal) {
      const earned = Math.floor(orderTotal / 100);
      this.points += earned;
      this.history.push({ type: 'earn', amount: earned });
      return earned;
    };

    this.spendPoints = function (amount) {
      if (amount > this.points) {
        throw new Error('Недостаточно баллов');
      }
      this.points -= amount;
      this.history.push({ type: 'spend', amount });
    };

    this.getLevel = function () {
      if (this.points >= 500) return 'Золото';
      if (this.points >= 100) return 'Серебро';
      return 'Бронза';
    };
  }
}
