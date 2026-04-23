import * as constants from '../../constants.js';

/**
 * Adds a meal to a specific day in a weekly menu.
 * Updates both the API (mock DB) and the global state.
 *
 * @param {Object} params
 * @param {Object} params.store - The store instance
 * @param {Object} params.api - The API instance
 * @param {Object} params.payload - { weekStartId, dayId, meal }
 */
export async function addMealToMenuAction({ store, api, payload }) {
  const { weekStartId, dayId, meal } = payload;

  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      status: constants.LOADING,
      errorMessage: null,
    },
  }));

  try {
    const addedMeal = await api.weeklyMenu.addMealToWeeklyMenu(weekStartId, dayId, meal);

    if (!addedMeal) {
      store.setState((state) => ({
        ...state,
        ui: {
          ...state.ui,
          status: constants.LOADED,
          errorMessage: 'Nepodařilo se přidat jídlo do menu.',
        },
      }));
      return;
    }

    // Refresh the weeklyMenus from the API to get the updated data
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
        errorMessage: error.message || 'Chyba při přidávání jídla.',
      },
    }));
  }
}
