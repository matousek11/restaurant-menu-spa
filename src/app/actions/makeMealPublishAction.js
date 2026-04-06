import * as constants from '../../constants.js';
import {publishMeal} from '../meal/mealTransitions.js';

/**
 * Transitions a meal from DRAFT to AVAILABLE via API.
 * Guards the transition locally before calling the API.
 */
export async function makeMealPublishAction({store, api, payload}) {
  const state = store.getState();
  const meal = state.meals.find((m) => m.id === payload.mealId);

  if (!meal) {
    return;
  }

  const transitioned = publishMeal(meal);
  if (transitioned.status === meal.status) {
    return;
  }

  store.setState((s) => ({
    ...s,
    ui: {
      ...s.ui,
      status: constants.LOADING,
      errorMessage: null,
    },
  }));

  const result = await api.meal.publishMeal(payload.mealId);

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
