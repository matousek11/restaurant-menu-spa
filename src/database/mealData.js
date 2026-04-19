import * as constants from '../constants.js';

export function getMeals() {
  return [
    {
      id: 'a1b2c3d4-0000-0000-0000-000000000001',
      status: constants.MEAL_AVAILABLE,
      name: {cz: 'Svíčková', en: 'Beef Sirloin in Cream Sauce'},
      price: 145,
      allergens: [1, 7, 9],
      description: null,
    },
    {
      id: 'a1b2c3d4-0000-0000-0000-000000000002',
      status: constants.MEAL_AVAILABLE,
      name: {cz: 'Smažený sýr', en: 'Fried Cheese'},
      price: 115,
      allergens: [1, 3, 7],
      description: null,
    },
    {
      id: 'a1b2c3d4-0000-0000-0000-000000000003',
      status: constants.MEAL_DRAFT,
      name: {cz: 'Guláš', en: 'Beef Goulash'},
      price: 135,
      allergens: [1],
      description: null,
    },
  ];
}
