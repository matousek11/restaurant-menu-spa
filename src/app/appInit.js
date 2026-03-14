import * as constants from '../constants';

export async function appInit(store, api) {
  try {
    let weeklyMenus = await api.weeklyMenu.getWeeklyMenus();

    store.setState((state) => ({
      ...state,
      weeklyMenus: weeklyMenus,
      ui: {
        ...state.ui,
        status: constants.LOADED,
      },
    }));
  } catch (error) {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        status: constants.ERROR,
        errorMessage: error.message,
      },
    }));
  }
}
