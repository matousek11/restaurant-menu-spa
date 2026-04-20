import * as constants from '../../constants.js';

/**
 * Deletes selected weekly menu.
 */
export async function makeWeeklyMenuDeleteAction({store, api, payload}) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      status: constants.LOADING,
    },
  }));

  const result = await api.weeklyMenu.removeWeeklyMenu(payload.weekStartId);
  if (result === false) {
    const t = store.getTranslator();
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        view: constants.ACTION_WEEKLY_MENU_LIST,
        status: constants.LOADED,
        errorMessage: t('unableToDeleteNonExistentWeeklyMenu'),
      },
    }));

    window.location.hash = '#/not-found'
    return;
  }

  store.setState((state) => ({
    ...state,
    weeklyMenus: state.weeklyMenus.filter(
      (weeklyMenu) => weeklyMenu.weekStartId !== payload.weekStartId,
    ),
    ui: {
      ...state.ui,
      view: constants.ACTION_WEEKLY_MENU_LIST,
      status: constants.LOADED,
    },
  }));

  window.location.hash = '#/weekly-menu'
}
