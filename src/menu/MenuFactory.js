import { Drink } from './Drink.js'
import { Dessert } from './Dessert.js'

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
    // throw new Error('Задача 2: MenuFactory.create ещё не реализован');
    switch (type) {
      case 'drink':
        return new Drink(data.name, data.price, data.size)
      case 'dessert':
        return new Dessert(data.name, data.price, data.isVegan)
      default:
        throw new Error(`Неизвестный тип позиции: ${type}`)
    }
  }

  static createMenu(list) {
    // throw new Error('Задача 2: MenuFactory.createMenu ещё не реализован')
    // drink - latte - 100 - M
    const menuData = list.reduce((acc, item) => {
      const { type, ...rest } = item
      acc.push(MenuFactory.create(type, rest))
      return acc
    }, [])
    return menuData
  }
}
