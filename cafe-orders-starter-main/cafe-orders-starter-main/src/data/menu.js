// Меню в том виде, в котором оно приходит «с сервера» -- обычные объекты.
// Превратить их в экземпляры классов должна фабрика (задача 2).
export const menuData = [
  { type: 'drink', name: 'Эспрессо', price: 120, size: 'S' },
  { type: 'drink', name: 'Капучино', price: 180, size: 'M' },
  { type: 'drink', name: 'Капучино', price: 180, size: 'L' },
  { type: 'drink', name: 'Латте', price: 200, size: 'M' },
  { type: 'drink', name: 'Раф', price: 230, size: 'L' },
  { type: 'dessert', name: 'Чизкейк', price: 250 },
  { type: 'dessert', name: 'Брауни', price: 220, isVegan: true },
  { type: 'dessert', name: 'Круассан', price: 150 },
];
