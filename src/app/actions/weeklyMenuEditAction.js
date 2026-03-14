import * as constants from '../../constants.js';

/**
 * Opens view with edit of existing weekly menu
 */
export async function weeklyMenuEditAction({store, api, payload}) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: constants.ACTION_WEEKLY_MENU_EDIT,
      status: constants.LOADING,
      selectedWeekStartId: null,
    },
  }));

  let weeklyMenu = await api.weeklyMenu.getWeeklyMenu(payload.weekStartId);
  if (weeklyMenu === null) {
    const t = store.getTranslator();
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        view: constants.ACTION_WEEKLY_MENU_LIST,
        status: constants.LOADED,
        errorMessage: t('weeklyMenuNotFound'),
      },
    }));

    return;
  }

  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      status: constants.LOADED,
      selectedWeekStartId: weeklyMenu.weekStartId,
    },
  }));
}
