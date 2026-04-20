import * as constants from '../../constants.js';

export async function weeklyMenuUpdateState({store, api, payload}) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: constants.ACTION_WEEKLY_MENU_UPDATE_STATE,
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

  const updatedWeeklyMenu = {
    ...weeklyMenu,
    state: payload.newState,
  };
  const result = await api.weeklyMenu.updateWeeklyMenu(updatedWeeklyMenu);
  if (result === null) {
    const t = store.getTranslator();
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        view: constants.ACTION_WEEKLY_MENU_LIST,
        status: constants.ERROR,
        errorMessage: t('unableToUpdateNonExistentWeeklyMenu'),
      },
    }));
    return;
  }

  store.setState((state) => ({
    ...state,
    weeklyMenus: state.weeklyMenus.map((weeklyMenu) => {
      if (weeklyMenu.weekStartId === payload.weekStartId) {
        return result;
      }
      return weeklyMenu;
    }),
    ui: {
      ...state.ui,
      status: constants.LOADED,
      selectedWeekStartId: weeklyMenu.weekStartId,
      view: constants.ACTION_WEEKLY_MENU_DETAIL,
    },
  }));
}