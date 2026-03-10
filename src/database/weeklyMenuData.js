import * as constants from '../constants.js';

/**
 * Starting weekly menus db
 */
export function getWeeklyMenus() {
  return [
    {
      weekStartId: '2026-02-16', // date of first day (monday) in a week
      state: constants.WEEKLY_MENU_PUBLISHED,
      days: [
        {
          dayId: 0, // 0-6
          meals: [
            {
              id: '54e4eb3d-0a67-484d-beb3-dd76dfdba9f9', // uuid
              templateId: null, // null (when not templated meal)
              name: {cz: 'Svíčková', en: 'Beef Sirloin in Cream Sauce'},
              price: 145,
              allergens: [1, 7, 9],
            },
          ],
        },
      ],
    },
  ];
}
