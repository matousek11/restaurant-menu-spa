import * as constants from '../../constants.js';

export function mealListAction({store}) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: constants.ACTION_MEAL_LIST,
      status: constants.LOADED,
      errorMessage: null,
    },
  }));
}
