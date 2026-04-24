import * as constants from '../../constants.js';
import {createMeal} from '../meal/mealTransitions.js';

export async function makeMealCreateAction({store, api, payload}) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      status: constants.LOADING,
      errorMessage: null,
    },
  }));

  const newMeal = createMeal(payload.meal);
  const result = await api.meal.addMeal(newMeal);

  store.setState((state) => ({
    ...state,
    meals: [...state.meals, result],
    ui: {
      ...state.ui,
      view: constants.ACTION_MEAL_LIST,
      status: constants.LOADED,
    },
  }));

  window.location.hash = '#/meals';
}
