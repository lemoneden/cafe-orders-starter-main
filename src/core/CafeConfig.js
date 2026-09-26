// ЗАДАЧА 4. Код работает, но с ошибками. Подробности в TASK.md.
export class CafeConfig {
  constructor() {
    this.settings = {
      cafeName: 'Кофейня «Зерно»',
      maxItemsPerOrder: 10,
      loyaltyPercent: 10,
      happyHourPercent: 20,
    };
  }

  get(key) {
    return this.settings[key];
  }

  set(key, value) {
    this.settings[key] = value;
  }
}
