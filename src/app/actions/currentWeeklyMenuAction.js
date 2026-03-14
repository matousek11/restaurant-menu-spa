import * as constants from '../../constants.js'

/**
 * Opens the view with a weekly menu for the current week.
 */
export async function currentWeeklyMenuAction({ store, api, payload }) {
  const weeklyMenuId = payload.weekStartId;
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: constants.ACTION_CURRENT_WEEKLY_MENU,
      status: constants.LOADING,
      selectedWeekStartId: weeklyMenuId,
    }
  }));

  const t = store.getTranslator();
  const weeklyMenu = await api.weeklyMenu.getWeeklyMenu(weeklyMenuId);
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      status: constants.LOADED,
      errorMessage: weeklyMenu === null ? t("currentWeeklyMenuNotFound") : null,
    }
  }));
}

