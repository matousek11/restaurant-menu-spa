import * as constants from '../../constants.js';
import {getMondayDateOfCurrentWeek} from '../helpers/dateManipulation.js';

/**
 * Updates weekStartId of an existing weekly menu.
 */
export async function weeklyMenuUpdateDateAction({store, api, payload}) {
  const {weekStartId, newWeekStartId} = payload;

  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: constants.ACTION_WEEKLY_MENU_DETAIL,
      status: constants.LOADING,
      selectedWeekStartId: weekStartId,
      errorMessage: null,
    },
  }));

  const t = store.getTranslator();
  const currentMonday = getMondayDateOfCurrentWeek();

  if (newWeekStartId < currentMonday) {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        view: constants.ACTION_WEEKLY_MENU_DETAIL,
        status: constants.ERROR,
        selectedWeekStartId: weekStartId,
        errorMessage: t('weeklyMenuDateCannotBeInPast'),
      },
    }));
    return;
  }

  if (newWeekStartId === weekStartId) {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        view: constants.ACTION_WEEKLY_MENU_DETAIL,
        status: constants.LOADED,
        selectedWeekStartId: weekStartId,
        errorMessage: null,
      },
    }));
    return;
  }

  const weeklyMenu = await api.weeklyMenu.getWeeklyMenu(weekStartId);
  if (weeklyMenu === null) {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        view: constants.ACTION_WEEKLY_MENU_LIST,
        status: constants.ERROR,
        selectedWeekStartId: null,
        errorMessage: t('weeklyMenuNotFound'),
      },
    }));
    return;
  }

  const alreadyExists = await api.weeklyMenu.getWeeklyMenu(newWeekStartId) !== null;
  if (alreadyExists) {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        view: constants.ACTION_WEEKLY_MENU_DETAIL,
        status: constants.ERROR,
        selectedWeekStartId: weekStartId,
        errorMessage: t('weeklyMenuAlreadyExists'),
      },
    }));
    return;
  }

  const updatedWeeklyMenu = {
    ...weeklyMenu,
    weekStartId: newWeekStartId,
  };
  const updated = await api.weeklyMenu.updateWeeklyMenu(updatedWeeklyMenu, weekStartId);
  console.log("updafasdfsadf", updated);
  store.setState((state) => ({
    ...state,
    weeklyMenus: [
      ...state.weeklyMenus.filter((menu) => menu.weekStartId !== weekStartId),
      updated,
    ],
    ui: {
      ...state.ui,
      view: constants.ACTION_WEEKLY_MENU_DETAIL,
      status: constants.LOADED,
      selectedWeekStartId: updated.weekStartId,
      errorMessage: null,
    },
  }));
}
