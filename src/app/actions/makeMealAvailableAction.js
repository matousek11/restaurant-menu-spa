import * as constants from '../../constants.js';
import {markMealAvailable} from '../meal/mealTransitions.js';

export async function makeMealAvailableAction({store, api, payload}) {
  const state = store.getState();
  const meal = state.meals.find((m) => m.id === payload.mealId);

  if (!meal) {
    return;
  }

  const transitioned = markMealAvailable(meal);
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

  const result = await api.meal.markMealAvailable(payload.mealId);

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
