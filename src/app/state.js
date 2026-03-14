import * as constants from '../constants.js';

/**
 * @returns initial state of application
 */
export function createInitialState() {
  return {
    // domain data
    weeklyMenus: [],
    meals: [],
    allergens: [],

    // authorization
    auth: {role: constants.UNAUTHORIZED},

    // UI state
    ui: {
      view: constants.ACTION_CURRENT_WEEKLY_MENU,
      selectedWeekStartId: null,
      language: constants.LANG_ENGLISH,
      status: constants.LOADING,
      errorMessage: null,
    },
  };
}
