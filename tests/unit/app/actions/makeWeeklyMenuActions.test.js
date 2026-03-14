import {describe, it, expect} from 'vitest';
import {createStore} from '../../../../src/infra/store/createStore';
import {createInitialState} from '../../../../src/app/state';
import * as constants from '../../../../src/constants';
import {makeWeeklyMenuCreateAction} from '../../../../src/app/actions/makeWeeklyMenuCreateAction';
import {getWeeklyMenus} from '../../../../src/database/weeklyMenuData';
import {getMockApi} from '../../../../src/api/mockApi';
import {makeWeeklyMenuEditAction} from '../../../../src/app/actions/makeWeeklyMenuEditAction';
import {makeWeeklyMenuDeleteAction} from '../../../../src/app/actions/makeWeeklyMenuDeleteAction';

const newWeeklyMenu = {
  weekStartId: '2026-02-23',
  state: constants.WEEKLY_MENU_DRAFT,
  days: [
    {
      dayId: 0,
      meals: [
        {
          id: '54e4eb3d-0a67-484d-aec3-dd76dfdba9f9',
          templateId: null,
          name: {cz: 'Svíčková', en: 'Beef Sirloin in Cream Sauce'},
          price: 145,
          allergens: [1, 7, 9],
        },
      ],
    },
  ],
};

function createWeeklyMenuTestSetup(weeklyMenus = getWeeklyMenus()) {
  const store = createStore(createInitialState());
  const api = getMockApi(weeklyMenus, true);
  store.setState((s) => ({...s, weeklyMenus: [...weeklyMenus]}));
  return {store, api, weeklyMenus};
}

describe('Make weekly menu actions (create, edit, delete)', () => {
  it('adds new weekly menu and navigates to detail', async () => {
    const {store, api, weeklyMenus} = createWeeklyMenuTestSetup();
    const payload = {weeklyMenu: newWeeklyMenu};

    await makeWeeklyMenuCreateAction({store, api, payload});

    const updatedState = store.getState();
    expect(updatedState.weeklyMenus).toHaveLength(weeklyMenus.length + 1);
    expect(
      updatedState.weeklyMenus.find(
        (m) => m.weekStartId === newWeeklyMenu.weekStartId,
      ),
    ).toBeDefined();
    expect(updatedState.ui.view).toBe(constants.ACTION_WEEKLY_MENU_DETAIL);
    expect(updatedState.ui.selectedWeekStartId).toBe(newWeeklyMenu.weekStartId);
    expect(updatedState.ui.status).toBe(constants.LOADED);
  });

  it('keeps create view and sets error when week already has a menu', async () => {
    const initialWeeklyMenus = getWeeklyMenus();
    initialWeeklyMenus[0].weekStartId = newWeeklyMenu.weekStartId;
    const {store, api, weeklyMenus} =
      createWeeklyMenuTestSetup(initialWeeklyMenus);
    const t = store.getTranslator();
    const payload = {weeklyMenu: newWeeklyMenu};

    await makeWeeklyMenuCreateAction({store, api, payload});

    const updatedState = store.getState();
    expect(updatedState.weeklyMenus).toHaveLength(weeklyMenus.length);
    expect(updatedState.ui.view).toBe(constants.ACTION_WEEKLY_MENU_CREATE);
    expect(updatedState.ui.errorMessage).toBe(t('weeklyMenuAlreadyExists'));
    expect(updatedState.ui.status).toBe(constants.LOADED);
  });

  it('updates weekly menu and navigates to detail', async () => {
    const initialWeeklyMenus = getWeeklyMenus();
    initialWeeklyMenus[0].weekStartId = newWeeklyMenu.weekStartId;
    const {store, api, weeklyMenus} =
      createWeeklyMenuTestSetup(initialWeeklyMenus);
    const payload = {weeklyMenu: newWeeklyMenu};

    await makeWeeklyMenuEditAction({store, api, payload});

    const updatedState = store.getState();
    expect(updatedState.weeklyMenus).toHaveLength(weeklyMenus.length);
    expect(updatedState.weeklyMenus[0].weekStartId).toBe(
      initialWeeklyMenus[0].weekStartId,
    );
    expect(updatedState.ui.view).toBe(constants.ACTION_WEEKLY_MENU_DETAIL);
    expect(updatedState.ui.selectedWeekStartId).toBe(
      initialWeeklyMenus[0].weekStartId,
    );
    expect(updatedState.ui.status).toBe(constants.LOADED);
  });

  it('keeps edit view and sets error when weekly menu does not exist', async () => {
    const {store, api, weeklyMenus} = createWeeklyMenuTestSetup();
    const t = store.getTranslator();
    const payload = {weeklyMenu: newWeeklyMenu};

    await makeWeeklyMenuEditAction({store, api, payload});

    const updatedState = store.getState();
    expect(updatedState.weeklyMenus).toHaveLength(weeklyMenus.length);
    expect(updatedState.ui.view).toBe(constants.ACTION_WEEKLY_MENU_EDIT);
    expect(updatedState.ui.selectedWeekStartId).toBe(newWeeklyMenu.weekStartId);
    expect(updatedState.ui.errorMessage).toBe(
      t('unableToUpdateNonExistentWeeklyMenu'),
    );
    expect(updatedState.ui.status).toBe(constants.LOADED);
  });

  it('removes weekly menu and navigates to list', async () => {
    const {store, api, weeklyMenus} = createWeeklyMenuTestSetup();
    const weekStartId = weeklyMenus[0].weekStartId;
    const payload = {weekStartId};

    await makeWeeklyMenuDeleteAction({store, api, payload});

    const updatedState = store.getState();
    expect(updatedState.weeklyMenus).toHaveLength(weeklyMenus.length - 1);
    expect(
      updatedState.weeklyMenus.find((m) => m.weekStartId === weekStartId),
    ).toBeUndefined();
    expect(updatedState.ui.view).toBe(constants.ACTION_WEEKLY_MENU_LIST);
    expect(updatedState.ui.status).toBe(constants.LOADED);
  });

  it('keeps list view and sets error when weekly menu to delete does not exist', async () => {
    const {store, api, weeklyMenus} = createWeeklyMenuTestSetup();
    const payload = {weekStartId: newWeeklyMenu.weekStartId};
    const t = store.getTranslator();

    await makeWeeklyMenuDeleteAction({store, api, payload});

    const updatedState = store.getState();
    expect(updatedState.weeklyMenus).toHaveLength(weeklyMenus.length);
    expect(updatedState.ui.view).toBe(constants.ACTION_WEEKLY_MENU_LIST);
    expect(updatedState.ui.status).toBe(constants.LOADED);
    expect(updatedState.ui.errorMessage).toBe(
      t('unableToDeleteNonExistentWeeklyMenu'),
    );
  });
});
