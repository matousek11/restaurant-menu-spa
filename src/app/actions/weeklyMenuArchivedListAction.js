import * as constants from '../../constants.js';

/**
 * Opens view with a list of archived weekly menus.
 */
export function weeklyMenuArchivedListAction({store}) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: constants.ACTION_WEEKLY_MENU_ARCHIVED_LIST,
      status: constants.LOADED,
    },
  }));
}
