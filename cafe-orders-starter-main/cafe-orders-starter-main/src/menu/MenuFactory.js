/**
 * ЗАДАЧА 2. Фабрика позиций меню.
 *
 * static create(type, data)
 *   'drink'   -> new Drink(data.name, data.price, data.size)
 *   'dessert' -> new Dessert(data.name, data.price, data.isVegan)
 *   любой другой тип -> Error с текстом «Неизвестный тип позиции: <type>»
 *
 * static createMenu(list)
 *   принимает массив объектов из src/data/menu.js
 *   и возвращает массив готовых позиций меню.
 */
export class MenuFactory {
  static create(type, data) {
    throw new Error('Задача 2: MenuFactory.create ещё не реализован');
  }

  static createMenu(list) {
    throw new Error('Задача 2: MenuFactory.createMenu ещё не реализован');
  }
}
