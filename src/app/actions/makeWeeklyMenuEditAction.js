import * as constants from '../../constants.js'

/**
 * Updates existing weekly menu.
 */
export async function makeWeeklyMenuEditAction({ store, api, payload }) {
  const weekStartId = payload.weeklyMenu.weekStartId
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      status: constants.LOADING,
      selectedWeekStartId: weekStartId,
    }
  }));

  const result = await api.weeklyMenu.updateWeeklyMenu(payload.weeklyMenu);
  if (result === null) {
    const t = store.getTranslator();
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        view: constants.ACTION_WEEKLY_MENU_EDIT,
        status: constants.LOADED,
        errorMessage: t("unableToUpdateNonExistentWeeklyMenu"),
      }
    }));

    return;
  }

  store.setState((state) => ({
    ...state,
    weeklyMenus: state.weeklyMenus.map(
      weeklyMenu => weeklyMenu.weekStartId === weekStartId ? result : weeklyMenu
    ),
    ui: {
      ...state.ui,
      view: constants.ACTION_WEEKLY_MENU_DETAIL,
      status: constants.LOADED,
    }
  }));
}

