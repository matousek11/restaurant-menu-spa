import * as constants from '../../constants.js';

export function mealCreateAction({store}) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: constants.ACTION_MEAL_CREATE,
      status: constants.LOADED,
      errorMessage: null,
    },
  }));
}
