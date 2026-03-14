import * as constants from '../../constants.js'

/**
 * Opens the view with a list of weekly menus.
 */
export function weeklyMenuListAction({ store }) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: constants.ACTION_WEEKLY_MENU_LIST,
      status: constants.LOADED,
    }
  }));
}
