import * as constants from '../../constants.js'

/**
 * Saves a new weekly menu.
 */
export async function makeWeeklyMenuCreateAction({ store, api, payload }) {
  const weeklyMenuId = payload.weeklyMenu.weekStartId
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      status: constants.LOADING,
      selectedWeekStartId: weeklyMenuId,
    }
  }));

  const result = await api.weeklyMenu.addWeeklyMenu(payload.weeklyMenu);
  if (result === null) {
    const t = store.getTranslator();
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        view: constants.ACTION_WEEKLY_MENU_CREATE,
        status: constants.LOADED,
        errorMessage: t("weeklyMenuAlreadyExists"),
      }
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
    }
  }));
}

