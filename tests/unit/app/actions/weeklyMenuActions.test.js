import {describe, it, expect} from 'vitest';
import * as constants from '../../../../src/constants';
import {createInitialState} from '../../../../src/app/state';
import {weeklyMenuCreateAction} from '../../../../src/app/actions/weeklyMenuCreateAction';
import {createStore} from '../../../../src/infra/store/createStore';
import {weeklyMenuEditAction} from '../../../../src/app/actions/weeklyMenuEditAction';
import {getMockApi} from '../../../../src/api/mockApi';
import {getWeeklyMenus} from '../../../../src/database/weeklyMenuData';
import {weeklyMenuDetailAction} from '../../../../src/app/actions/weeklyMenuDetailAction';
import {currentWeeklyMenuAction} from '../../../../src/app/actions/currentWeeklyMenuAction';
import {getMondayDateOfCurrentWeek} from '../../../../src/app/helpers/dateManipulation';
import {weeklyMenuListAction} from '../../../../src/app/actions/weeklyMenuListAction';

function createWeeklyMenuTestSetup(weeklyMenus = getWeeklyMenus()) {
  const store = createStore(createInitialState());
  const api = getMockApi(weeklyMenus, true);
  return {store, api, weeklyMenus};
}

describe('Weekly menu actions (view/navigation only)', () => {
  it('navigates to create weekly menu view', () => {
    const store = createStore(createInitialState());

    weeklyMenuCreateAction({store});

    const updatedState = store.getState();
    expect(updatedState.ui.view).toBe(constants.ACTION_WEEKLY_MENU_CREATE);
    expect(updatedState.ui.status).toBe(constants.LOADED);
  });

  it('navigates to edit view when weekly menu exists', async () => {
    const {store, api, weeklyMenus} = createWeeklyMenuTestSetup();
    const weeklyMenuId = weeklyMenus[0].weekStartId;
    const payload = {weekStartId: weeklyMenuId};

    await weeklyMenuEditAction({store, api, payload});

    const updatedState = store.getState();
    expect(updatedState.ui.status).toBe(constants.LOADED);
    expect(updatedState.ui.selectedWeekStartId).toBe(weeklyMenuId);
  });

  it('returns to list and sets error when weekly menu to edit does not exist', async () => {
    const {store, api} = createWeeklyMenuTestSetup();
    const t = store.getTranslator();
    const payload = {weekStartId: '2026-02-10'};

    await weeklyMenuEditAction({store, api, payload});

    const updatedState = store.getState();
    expect(updatedState.ui.view).toBe(constants.ACTION_WEEKLY_MENU_LIST);
    expect(updatedState.ui.status).toBe(constants.LOADED);
    expect(updatedState.ui.errorMessage).toBe(t('weeklyMenuNotFound'));
    expect(updatedState.ui.selectedWeekStartId).toBe(null);
  });

  it('navigates to detail view when weekly menu exists', async () => {
    const {store, api, weeklyMenus} = createWeeklyMenuTestSetup();
    const weeklyMenuId = weeklyMenus[0].weekStartId;
    const payload = {weekStartId: weeklyMenuId};

    await weeklyMenuDetailAction({store, api, payload});

    const updatedState = store.getState();
    expect(updatedState.ui.status).toBe(constants.LOADED);
    expect(updatedState.ui.view).toBe(constants.ACTION_WEEKLY_MENU_DETAIL);
    expect(updatedState.ui.selectedWeekStartId).toBe(weeklyMenuId);
  });

  it('returns to list and sets error when weekly menu detail does not exist', async () => {
    const {store, api} = createWeeklyMenuTestSetup();
    const t = store.getTranslator();
    const payload = {weeklyMenuId: '2026-02-10'};

    await weeklyMenuDetailAction({store, api, payload});

    const updatedState = store.getState();
    expect(updatedState.ui.view).toBe(constants.ACTION_WEEKLY_MENU_LIST);
    expect(updatedState.ui.status).toBe(constants.LOADED);
    expect(updatedState.ui.errorMessage).toBe(t('weeklyMenuNotFound'));
    expect(updatedState.ui.selectedWeekStartId).toBe(null);
  });

  it('navigates to current week view when weekly menu for current week exists', async () => {
    const initialWeeklyMenus = getWeeklyMenus();
    const weekStartId = getMondayDateOfCurrentWeek();
    initialWeeklyMenus[0].weekStartId = weekStartId;
    const {store, api} = createWeeklyMenuTestSetup(initialWeeklyMenus);
    const payload = {weekStartId: weekStartId};

    await currentWeeklyMenuAction({store, api, payload});

    const updatedState = store.getState();
    expect(updatedState.ui.status).toBe(constants.LOADED);
    expect(updatedState.ui.view).toBe(constants.ACTION_CURRENT_WEEKLY_MENU);
    expect(updatedState.ui.selectedWeekStartId).toBe(weekStartId);
    expect(updatedState.ui.errorMessage).toBe(null);
  });

  it('sets error when opening current week view and no weekly menu exists', async () => {
    const initialWeeklyMenus = getWeeklyMenus().map((menu, index) => ({
      ...menu,
      weekStartId: index === 0 ? '2099-01-05' : '2099-01-12',
    }));
    const {store, api} = createWeeklyMenuTestSetup(initialWeeklyMenus);
    const t = store.getTranslator();
    const payload = {weekStartId: getMondayDateOfCurrentWeek()};

    await currentWeeklyMenuAction({store, api, payload});

    const updatedState = store.getState();
    expect(updatedState.ui.status).toBe(constants.LOADED);
    expect(updatedState.ui.view).toBe(constants.ACTION_CURRENT_WEEKLY_MENU);
    expect(updatedState.ui.errorMessage).toBe(t('currentWeeklyMenuNotFound'));
  });

  it('navigates to weekly menu list view', () => {
    const store = createStore(createInitialState());

    weeklyMenuListAction({store});

    const updatedState = store.getState();
    expect(updatedState.ui.status).toBe(constants.LOADED);
    expect(updatedState.ui.view).toBe(constants.ACTION_WEEKLY_MENU_LIST);
  });
});
