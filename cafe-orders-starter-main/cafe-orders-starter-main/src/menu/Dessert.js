import { MenuItem } from './MenuItem.js'

/**
 * ЗАДАЧА 1. Десерт.
 *
 * constructor(name, basePrice, isVegan = false)
 *
 * isVegan   только геттер, приватное поле. Изменить после создания нельзя.
 * getCategory()  возвращает 'Десерты'.
 * describe()     для веганского десерта -- «Брауни (веган) — 220 руб.»,
 *                для обычного -- «Чизкейк — 250 руб.»
 */
export class Dessert extends MenuItem {
  #isVegan

  constructor(name, basePrice, isVegan = false) {
    super(name, basePrice)
    this.isVegan = isVegan
  }

  get isVegan() {
    return this.#isVegan
  }

  getCategory() {
    return 'Десерты'
  }
}
