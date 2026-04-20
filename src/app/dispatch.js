import * as constants from '../constants.js';
import {weeklyMenuCreateAction} from './actions/weeklyMenuCreateAction.js';
import {weeklyMenuEditAction} from './actions/weeklyMenuEditAction.js';
import {weeklyMenuListAction} from './actions/weeklyMenuListAction.js';
import {weeklyMenuDetailAction} from './actions/weeklyMenuDetailAction.js';
import {currentWeeklyMenuAction} from './actions/currentWeeklyMenuAction.js';
import {makeWeeklyMenuCreateAction} from './actions/makeWeeklyMenuCreateAction.js';
import {makeWeeklyMenuEditAction} from './actions/makeWeeklyMenuEditAction.js';
import {makeWeeklyMenuDeleteAction} from './actions/makeWeeklyMenuDeleteAction.js';
import {getMondayDateOfCurrentWeek} from './helpers/dateManipulation.js';
import {mealListAction} from './actions/mealListAction.js';
import {mealCreateAction} from './actions/mealCreateAction.js';
import {makeMealCreateAction} from './actions/makeMealCreateAction.js';
import {makeMealPublishAction} from './actions/makeMealPublishAction.js';
import {makeMealUnavailableAction} from './actions/makeMealUnavailableAction.js';
import {makeMealAvailableAction} from './actions/makeMealAvailableAction.js';
import {makeMealUpdateAction} from './actions/makeMealUpdateAction.js';
import {enterSubscriptionsAction} from './actions/enterSubscriptionsAction.js';
import {enterSubscriptionDetailAction} from './actions/enterSubscriptionDetailAction.js';
import {createSubscriptionAction} from './actions/createSubscriptionAction.js';
import {pauseSubscriptionAction} from './actions/pauseSubscriptionAction.js';
import {resumeSubscriptionAction} from './actions/resumeSubscriptionAction.js';
import {cancelSubscriptionAction} from './actions/cancelSubscriptionAction.js';
import {enterSubscriptionCreateAction} from './actions/enterSubscriptionCreateAction.js';
import {weeklyMenuUpdateState} from './actions/weeklyMenuUpdateState.js';
import {weeklyMenuUpdateDateAction} from './actions/weeklyMenuUpdateDateAction.js';

/**
 *
 * @param store
 * @param {import('../api/mockApi').MockApi} api
 * @returns {(function(*): Promise<void|string>)|*}
 */
export function createDispatcher(store, api) {
  return async function dispatch(action) {
    console.log('Dispatch action type: ' + action.type);

    switch (action.type) {
      case constants.ACTION_WEEKLY_MENU_CREATE:
        return weeklyMenuCreateAction({store});
      case constants.ACTION_WEEKLY_MENU_EDIT:
        return weeklyMenuEditAction({store, api, payload: action.payload});
      case constants.ACTION_WEEKLY_MENU_UPDATE_STATE:
        return weeklyMenuUpdateState({store, api, payload: action.payload});
      case constants.ACTION_WEEKLY_MENU_UPDATE_DATE:
        return weeklyMenuUpdateDateAction({store, api, payload: action.payload});
      case constants.ACTION_WEEKLY_MENU_LIST:
        return weeklyMenuListAction({store});
      case constants.ACTION_WEEKLY_MENU_DETAIL:
        return weeklyMenuDetailAction({store, api, payload: action.payload});
      case constants.ACTION_CURRENT_WEEKLY_MENU:
        const payload = {weekStartId: getMondayDateOfCurrentWeek()};
        return currentWeeklyMenuAction({store, api, payload});
      case constants.ACTION_MAKE_WEEKLY_MENU_CREATE:
        return makeWeeklyMenuCreateAction({
          store,
          api,
          payload: action.payload,
        });
      case constants.ACTION_MAKE_WEEKLY_MENU_EDIT:
        return makeWeeklyMenuEditAction({store, api, payload: action.payload});
      case constants.ACTION_MAKE_WEEKLY_MENU_DELETE:
        return makeWeeklyMenuDeleteAction({
          store,
          api,
          payload: action.payload,
        });
      case constants.ACTION_MEAL_LIST:
        return mealListAction({store});
      case constants.ACTION_MEAL_CREATE:
        return mealCreateAction({store});
      case constants.ACTION_MAKE_MEAL_CREATE:
        return makeMealCreateAction({store, api, payload: action.payload});
      case constants.ACTION_MAKE_MEAL_PUBLISH:
        return makeMealPublishAction({store, api, payload: action.payload});
      case constants.ACTION_MAKE_MEAL_MARK_UNAVAILABLE:
        return makeMealUnavailableAction({store, api, payload: action.payload});
      case constants.ACTION_MAKE_MEAL_MARK_AVAILABLE:
        return makeMealAvailableAction({store, api, payload: action.payload});
      case constants.ACTION_MAKE_MEAL_UPDATE:
        return makeMealUpdateAction({store, api, payload: action.payload});
      case constants.ACTION_ENTER_SUBSCRIPTIONS:
        return enterSubscriptionsAction({store});
      case constants.ACTION_ENTER_SUBSCRIPTION_DETAIL:
        return enterSubscriptionDetailAction({store, payload: action.payload});
      case constants.ACTION_ENTER_SUBSCRIPTION_CREATE:
        return enterSubscriptionCreateAction({store});
      case constants.ACTION_CREATE_SUBSCRIPTION:
        return createSubscriptionAction({store, api, payload: action.payload});
      case constants.ACTION_PAUSE_SUBSCRIPTION:
        return pauseSubscriptionAction({store, api, payload: action.payload});
      case constants.ACTION_RESUME_SUBSCRIPTION:
        return resumeSubscriptionAction({store, api, payload: action.payload});
      case constants.ACTION_CANCEL_SUBSCRIPTION:
        return cancelSubscriptionAction({store, api, payload: action.payload});

      default:
        console.error('Unknown action: ' + action);
    }
  };
}
