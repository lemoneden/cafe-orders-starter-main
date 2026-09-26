// Готовый миксин. Менять не нужно.
// Подключается к классу через Object.assign(ClassName.prototype, Logger)
export const Logger = {
  log(message) {
    const time = new Date().toLocaleTimeString('ru-RU');
    console.log(`[${time}] [${this.constructor.name}] ${message}`);
  },
};
