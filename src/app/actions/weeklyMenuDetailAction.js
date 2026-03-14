import * as constants from '../../constants.js'

/**
 * Opens the view with a detail of a weekly menu.
 */
export async function weeklyMenuDetailAction({ store, api, payload }) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: constants.ACTION_WEEKLY_MENU_DETAIL,
      status: constants.LOADING,
      selectedWeekStartId: payload.weekStartId,
    }
  }));

  const weeklyMenu = await api.weeklyMenu.getWeeklyMenu(payload.weekStartId);
  if (weeklyMenu === null) {
    const t = store.getTranslator();
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        view: constants.ACTION_WEEKLY_MENU_LIST,
        status: constants.LOADED,
        selectedWeekStartId: null,
        errorMessage: t("weeklyMenuNotFound"),
      }
    }));
    return;
  }

  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      status: constants.LOADED,
    }
  }));
}