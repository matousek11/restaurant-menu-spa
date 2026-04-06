import * as constants from '../constants.js';
import {createInitialAuthState} from './auth/authTransitions.js';

/**
 * @returns initial state of application
 */
export function createInitialState() {
  return {
    // domain data
    weeklyMenus: [],
    meals: [],
    allergens: [],

    // authorization – restored from localStorage if a token exists
    auth: createInitialAuthState(),

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
