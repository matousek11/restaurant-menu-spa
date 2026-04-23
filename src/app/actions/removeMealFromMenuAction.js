import * as constants from '../../constants.js';

/**
 * Removes a meal from a specific day in a weekly menu.
 *
 * @param {Object} params
 * @param {Object} params.store - The store instance
 * @param {Object} params.api - The API instance
 * @param {Object} params.payload - { weekStartId, dayId, mealId }
 */
export async function removeMealFromMenuAction({ store, api, payload }) {
  const { weekStartId, dayId, mealId } = payload;

  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      status: constants.LOADING,
      errorMessage: null,
    },
  }));

  try {
    await api.weeklyMenu.removeMealFromWeeklyMenu(weekStartId, dayId, mealId);

    // Refresh the weeklyMenus from the API
    const updatedMenus = await api.weeklyMenu.getWeeklyMenus();

    store.setState((state) => ({
      ...state,
      weeklyMenus: updatedMenus,
      ui: {
        ...state.ui,
        status: constants.LOADED,
        errorMessage: null,
      },
    }));
  } catch (error) {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        status: constants.LOADED,
        errorMessage: error.message || 'Chyba při odstraňování jídla.',
      },
    }));
  }
}
