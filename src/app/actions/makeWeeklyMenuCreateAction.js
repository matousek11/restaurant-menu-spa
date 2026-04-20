import * as constants from '../../constants.js';
import {getMondayDateOfCurrentWeek} from '../helpers/dateManipulation.js';

/**
 * Saves a new weekly menu.
 */
export async function makeWeeklyMenuCreateAction({store, api, payload}) {
  const weeklyMenuId = payload.weeklyMenu.weekStartId;
  const t = store.getTranslator();

  if (weeklyMenuId < getMondayDateOfCurrentWeek()) {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        view: constants.ACTION_WEEKLY_MENU_CREATE,
        status: constants.ERROR,
        selectedWeekStartId: null,
        errorMessage: t('weeklyMenuDateCannotBeInPast'),
      },
    }));
    return;
  }

  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      status: constants.LOADING,
      selectedWeekStartId: weeklyMenuId,
    },
  }));

  const result = await api.weeklyMenu.addWeeklyMenu(payload.weeklyMenu);
  if (result === null) {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        view: constants.ACTION_WEEKLY_MENU_CREATE,
        status: constants.LOADED,
        errorMessage: t('weeklyMenuAlreadyExists'),
      },
    }));

    return;
  }

  store.setState((state) => ({
    ...state,
    weeklyMenus: [...state.weeklyMenus, result],
    ui: {
      ...state.ui,
      view: constants.ACTION_WEEKLY_MENU_DETAIL,
      status: constants.LOADED,
      selectedWeekStartId: result.weekStartId,
    },
  }));
}
