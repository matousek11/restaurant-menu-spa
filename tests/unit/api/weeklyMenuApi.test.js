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
          id: '54e4eb3d-0a67-484d-aec3-dd76dfdba8f8',
          templateId: null,
          name: {cz: 'Svíčková', en: 'Beef Sirloin in Cream Sauce'},
          price: 145,
          allergens: [1, 7, 9],
        },
      ],
    },
  ],
};

function getTestMockApi(weeklyMenusStart) {
  return getWeeklyMenuApi(weeklyMenusStart, true);
}

describe('Weekly menu API', () => {
  it('Should successfully add weekly menu', async () => {
    const expectedWeeklyMenus = getWeeklyMenus();
    const weeklyMenuApi = getTestMockApi(expectedWeeklyMenus);
    expectedWeeklyMenus.push(additionalWeeklyMenu);

    const result = await weeklyMenuApi.addWeeklyMenu(additionalWeeklyMenu);
    expect(result).toEqual(additionalWeeklyMenu);

    const allWeeklyMenus = await weeklyMenuApi.getWeeklyMenus();
    expect(allWeeklyMenus).toEqual(expectedWeeklyMenus);
  });

  it('Should successfully update an existing weekly menu', async () => {
    const initialMenus = getWeeklyMenus();
    initialMenus.push(additionalWeeklyMenu);

    const weeklyMenuApi = getTestMockApi(initialMenus);

    const menuToUpdate = structuredClone(additionalWeeklyMenu);
    menuToUpdate.state = constants.WEEKLY_MENU_DRAFT;

    const result = await weeklyMenuApi.updateWeeklyMenu(menuToUpdate);

    const expectedMenus = structuredClone(initialMenus);

    const targetIndex = expectedMenus.findIndex(
      (menu) => menu.weekStartId === menuToUpdate.weekStartId,
    );
    expectedMenus[targetIndex] = menuToUpdate;
    expect(result).toEqual(menuToUpdate);

    const allWeeklyMenus = await weeklyMenuApi.getWeeklyMenus();
    expect(allWeeklyMenus).toEqual(expectedMenus);
  });

  it('Should fail to update an existing weekly menu', async () => {
    const initialWeeklyMenus = getWeeklyMenus();
    const weeklyMenuApi = getTestMockApi(initialWeeklyMenus);

    const menuToUpdate = structuredClone(additionalWeeklyMenu);
    menuToUpdate.weekStartId = nonExistingWeeklyMenuId;
    menuToUpdate.state = constants.WEEKLY_MENU_DRAFT;

    const result = await weeklyMenuApi.updateWeeklyMenu(menuToUpdate);
    expect(result).toBe(null);

    const allWeeklyMenus = await weeklyMenuApi.getWeeklyMenus();
    expect(allWeeklyMenus).toEqual(initialWeeklyMenus);
  });

  it('Should successfully get all weekly menus', async () => {
    const expectedWeeklyMenus = getWeeklyMenus();

    const weeklyMenuApi = getTestMockApi(expectedWeeklyMenus);
    const result = await weeklyMenuApi.getWeeklyMenus();
    expect(result).toEqual(expectedWeeklyMenus);
  });

  it('Should successfully get specific weekly menu', async () => {
    const expectedWeeklyMenus = getWeeklyMenus();

    const weeklyMenuApi = getTestMockApi(expectedWeeklyMenus);
    const result = await weeklyMenuApi.getWeeklyMenu(
      expectedWeeklyMenus[0].weekStartId,
    );
    expect(result).toEqual(expectedWeeklyMenus[0]);
  });

  it('Should fail to get specific weekly menu', async () => {
    const expectedWeeklyMenus = getWeeklyMenus();

    const weeklyMenuApi = getTestMockApi(expectedWeeklyMenus);
    const result = await weeklyMenuApi.getWeeklyMenu(nonExistingWeeklyMenuId);
    expect(result).toBe(null);
  });

  it('Should successfully remove an existing weekly menu', async () => {
    const initialMenus = getWeeklyMenus();
    initialMenus.push(additionalWeeklyMenu);

    const weeklyMenuApi = getTestMockApi(initialMenus);

    const result = await weeklyMenuApi.removeWeeklyMenu(
      initialMenus[0].weekStartId,
    );

    let expectedMenus = structuredClone(initialMenus);

    expectedMenus = expectedMenus.filter(
      (menu) => menu.weekStartId !== initialMenus[0].weekStartId,
    );
    expect(result).toBe(true);

    const allWeeklyMenus = await weeklyMenuApi.getWeeklyMenus();
    expect(allWeeklyMenus).toEqual(expectedMenus);
  });

  it('Should fail to remove an non-existing weekly menu', async () => {
    const initialMenus = getWeeklyMenus();
    initialMenus.push(additionalWeeklyMenu);

    const weeklyMenuApi = getTestMockApi(initialMenus);

    const result = await weeklyMenuApi.removeWeeklyMenu(
      nonExistingWeeklyMenuId,
    );

    expect(result).toBe(false);
    const allWeeklyMenus = await weeklyMenuApi.getWeeklyMenus();
    expect(allWeeklyMenus).toEqual(initialMenus);
  });
});
