import * as constants from '../constants';
import {logout} from './auth/authTransitions.js';

export async function appInit(store, api) {
  try {
    const [weeklyMenus, meals] = await Promise.all([
      api.weeklyMenu.getWeeklyMenus(),
      api.meal.getMeals(),
    ]);

    store.setState((state) => ({
      ...state,
      weeklyMenus,
      meals,
      ui: {
        ...state.ui,
        status: constants.LOADED,
      },
    }));
  } catch (error) {
    if (error?.status === 401) {
      store.setState((state) => ({
        ...state,
        auth: logout(state.auth),
        ui: {
          ...state.ui,
          status: constants.ERROR,
          errorMessage: 'Session expired. Please log in again.',
        },
      }));
      return;
    }

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
