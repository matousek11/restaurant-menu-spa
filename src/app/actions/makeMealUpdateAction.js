import * as constants from '../../constants.js';

/**
 * Updates meal data (name, price, allergens) for a meal in DRAFT state via API.
 */
export async function makeMealUpdateAction({store, api, payload}) {
  store.setState((s) => ({
    ...s,
    ui: {
      ...s.ui,
      status: constants.LOADING,
      errorMessage: null,
    },
  }));

  const result = await api.meal.updateMeal(payload.meal);

  if (result === null) {
    store.setState((s) => ({
      ...s,
      ui: {
        ...s.ui,
        status: constants.LOADED,
        errorMessage: 'Meal not found.',
      },
    }));
    return;
  }

  store.setState((s) => ({
    ...s,
    meals: s.meals.map((m) => (m.id === result.id ? result : m)),
    ui: {
      ...s.ui,
      status: constants.LOADED,
    },
  }));
}
