import * as constants from '../../constants.js';

/**
 * Opens the view with a view for creation of a new weekly menu.
 */
export function weeklyMenuCreateAction({store}) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: constants.ACTION_WEEKLY_MENU_CREATE,
      status: constants.LOADED,
    },
  }));
}
