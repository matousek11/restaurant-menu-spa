import {getWeeklyMenuApi} from './weeklyMenuApi';
import {getAuthApi} from './authApi';
import {getSubscriptionApi} from './subscriptionApi';

/**
 * @typedef {Object} MockApi
 * @property {import('./weeklyMenuApi').WeeklyMenuApi} weeklyMenu
 * @property {null} meal
 * @property {Object} subscription
 * @property {Object} auth
 */

/**
 * Mocks backend of application.
 *
 * @param {boolean} skipDelay when true delays simulating async communication is skipped
 * @param {any[]} weeklyMenusStart initial state
 * @returns {MockApi} mock APIs for available entities
 */
export function getMockApi(weeklyMenusStart, skipDelay = false) {
  /** @type {import('./weeklyMenuApi').WeeklyMenuApi} */
  const weeklyMenuApi = getWeeklyMenuApi(weeklyMenusStart, skipDelay);
  const authApi = getAuthApi(skipDelay);
  const subscriptionApi = getSubscriptionApi(undefined, skipDelay);

  return {
    weeklyMenu: weeklyMenuApi,
    meal: null,
    subscription: subscriptionApi,
    auth: authApi,
  };
}
