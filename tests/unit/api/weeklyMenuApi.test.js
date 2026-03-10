import {describe, it, expect} from 'vitest';
import {getWeeklyMenus} from '../../../src/database/weeklyMenuData';
import {getWeeklyMenuApi} from '../../../src/api/weeklyMenuApi';
import * as constants from '../../../src/constants';

const nonExistingWeeklyMenuId = '2026-02-10';

const additionalWeeklyMenu = {
  weekStartId: '2026-02-9',
  state: constants.WEEKLY_MENU_PUBLISHED,
  days: [
    {
      dayId: 2,
      meals: [
        {
          id: null, // uuid
          templateId: null, // null (when not templated meal)
          name: {cz: 'Svíčková', en: 'Beef Sirloin in Cream Sauce'},
          price: 145,
          allergens: [1, 7, 9],
        },
      ],
    },
  ],
};

describe('Weekly menu API', () => {
  it('Should successfully add weekly menu', async () => {
    const expectedWeeklyMenus = getWeeklyMenus();
    const weeklyMenuApi = getWeeklyMenuApi(expectedWeeklyMenus);
    expectedWeeklyMenus.push(additionalWeeklyMenu);

    const result = await weeklyMenuApi.addWeeklyMenu(additionalWeeklyMenu);

    expect(result).toEqual(expectedWeeklyMenus);
  });

  it('Should successfully update an existing weekly menu', async () => {
    const initialMenus = getWeeklyMenus();
    initialMenus.push(additionalWeeklyMenu);

    const weeklyMenuApi = getWeeklyMenuApi(initialMenus);

    const menuToUpdate = structuredClone(additionalWeeklyMenu);
    menuToUpdate.state = constants.WEEKLY_MENU_DRAFT;

    const result = await weeklyMenuApi.updateWeeklyMenu(menuToUpdate);

    const expectedMenus = structuredClone(initialMenus);

    const targetIndex = expectedMenus.findIndex(
      (menu) => menu.weekStartId === menuToUpdate.weekStartId,
    );
    expectedMenus[targetIndex] = menuToUpdate;

    expect(result).toEqual(expectedMenus);
  });

  it('Should fail to update an existing weekly menu', async () => {
    const weeklyMenuApi = getWeeklyMenuApi(getWeeklyMenus());

    const menuToUpdate = structuredClone(additionalWeeklyMenu);
    menuToUpdate.weekStartId = nonExistingWeeklyMenuId;
    menuToUpdate.state = constants.WEEKLY_MENU_DRAFT;

    const result = await weeklyMenuApi.updateWeeklyMenu(menuToUpdate);

    expect(result).toBe(null);
  });

  it('Should successfully get all weekly menus', async () => {
    const expectedWeeklyMenus = getWeeklyMenus();

    const weeklyMenuApi = getWeeklyMenuApi(expectedWeeklyMenus);
    const result = await weeklyMenuApi.getWeeklyMenus();

    expect(result).toEqual(expectedWeeklyMenus);
  });

  it('Should successfully get specific weekly menu', async () => {
    const expectedWeeklyMenus = getWeeklyMenus();

    const weeklyMenuApi = getWeeklyMenuApi(expectedWeeklyMenus);
    const result = await weeklyMenuApi.getWeeklyMenu(
      expectedWeeklyMenus[0].weekStartId,
    );

    expect(result).toEqual(expectedWeeklyMenus[0]);
  });

  it('Should fail to get specific weekly menu', async () => {
    const expectedWeeklyMenus = getWeeklyMenus();

    const weeklyMenuApi = getWeeklyMenuApi(expectedWeeklyMenus);
    const result = await weeklyMenuApi.getWeeklyMenu(nonExistingWeeklyMenuId);

    expect(result).toBe(null);
  });

  it('Should successfully remove an existing weekly menu', async () => {
    const initialMenus = getWeeklyMenus();
    initialMenus.push(additionalWeeklyMenu);

    const weeklyMenuApi = getWeeklyMenuApi(initialMenus);

    const result = await weeklyMenuApi.removeWeeklyMenu(
      initialMenus[0].weekStartId,
    );

    let expectedMenus = structuredClone(initialMenus);

    expectedMenus = expectedMenus.filter(
      (menu) => menu.weekStartId !== initialMenus[0].weekStartId,
    );

    expect(result).toEqual(expectedMenus);
  });

  it('Should fail to remove an non-existing weekly menu', async () => {
    const initialMenus = getWeeklyMenus();
    initialMenus.push(additionalWeeklyMenu);

    const weeklyMenuApi = getWeeklyMenuApi(initialMenus);

    const result = await weeklyMenuApi.removeWeeklyMenu(
      nonExistingWeeklyMenuId,
    );

    expect(result).toBe(null);
  });
});
