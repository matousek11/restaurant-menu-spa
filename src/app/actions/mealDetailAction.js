import * as constants from '../../constants.js';

export function mealDetailAction({store, payload}) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: constants.ACTION_MEAL_DETAIL,
      selectedMealId: payload.mealId,
      status: constants.LOADED,
      errorMessage: null,
    },
  }));
}
