import * as constants from '../constants.js'
import {weeklyMenuCreateAction} from './actions/weeklyMenuCreateAction';
import {weeklyMenuEditAction} from './actions/weeklyMenuEditAction';
import {weeklyMenuListAction} from './actions/weeklyMenuListAction';
import {weeklyMenuDetailAction} from './actions/weeklyMenuDetailAction';
import {currentWeeklyMenuAction} from './actions/currentWeeklyMenuAction';
import {makeWeeklyMenuCreateAction} from './actions/makeWeeklyMenuCreateAction';
import {makeWeeklyMenuEditAction} from './actions/makeWeeklyMenuEditAction';
import {makeWeeklyMenuDeleteAction} from './actions/makeWeeklyMenuDeleteAction';
import {getMondayDateOfCurrentWeek} from './helpers/dateManipulation';

/**
 *
 * @param store
 * @param {import('../api/mockApi').MockApi} api
 * @returns {(function(*): Promise<void|string>)|*}
 */
export function createDispatcher(store, api) {
  return async function dispatch(action) {
    console.log("Dispatch action: " + action);

    switch (action.type) {
      case constants.ACTION_WEEKLY_MENU_CREATE:
        return weeklyMenuCreateAction({store});
      case constants.ACTION_WEEKLY_MENU_EDIT:
        return weeklyMenuEditAction({store, api, payload: action.payload});
      case constants.ACTION_WEEKLY_MENU_LIST:
        return weeklyMenuListAction({store});
      case constants.ACTION_WEEKLY_MENU_DETAIL:
        return weeklyMenuDetailAction({store, api, payload: action.payload});
      case constants.ACTION_CURRENT_WEEKLY_MENU:
        const payload = {weeklyMenuId: getMondayDateOfCurrentWeek()};
        return currentWeeklyMenuAction({store, api, payload});
      case constants.ACTION_MAKE_WEEKLY_MENU_CREATE:
        return makeWeeklyMenuCreateAction(
          {store, api, payload: action.payload},
        );
      case constants.ACTION_MAKE_WEEKLY_MENU_EDIT:
        return makeWeeklyMenuEditAction(
          {store, api, payload: action.payload},
        );
      case constants.ACTION_MAKE_WEEKLY_MENU_DELETE:
        return makeWeeklyMenuDeleteAction(
          {store, api, payload: action.payload},
        );
      default:
        console.error("Unknown action: " + action);
    }
  }
}