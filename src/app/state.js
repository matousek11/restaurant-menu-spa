import * as constants from '../constants.js';

/**
 * @returns initial state of application
 */
export function createInitialState() {
  return {
    // domain data
    weeklyMenus: [],
    meals: [],
    subscriptions: [],

    // identity
    currentUser: { userId: 'user-1' },

    // authorization
    auth: { role: constants.UNAUTHORIZED },

    // UI state
    ui: {
      view: constants.ACTION_CURRENT_WEEKLY_MENU,
      mode: constants.MODE_SUBSCRIPTION_LIST,
      selectedWeekStartId: null,
      selectedSubscriptionId: null,
      language: constants.LANG_ENGLISH,
      status: constants.LOADING,
      errorMessage: null,
    },
  };
}
