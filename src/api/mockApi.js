import {getWeeklyMenuApi} from './weeklyMenuApi.js';
import {getAuthApi} from './authApi.js';
import {getMealApi} from './mealApi.js';
import {getSubscriptionApi} from './subscriptionApi.js';

/**
 * @typedef {Object} MockApi
 * @property {import('./weeklyMenuApi').WeeklyMenuApi} weeklyMenu
 * @property {import('./mealApi').MealApi} meal
 * @property {Object} subscription
 * @property {Object} auth
 */

/**
 * Mocks backend of application.
 *
 * @param {boolean} skipDelay when true delays simulating async communication is skipped
 * @param {any[]} weeklyMenusStart initial state
 * @param {any[]} mealsStart
 * @returns {MockApi} mock APIs for available entities
 */
export function getMockApi(weeklyMenusStart, skipDelay = false, mealsStart = []) {
  /** @type {import('./weeklyMenuApi').WeeklyMenuApi} */
  const weeklyMenuApi = getWeeklyMenuApi(weeklyMenusStart, skipDelay);
  const authApi = getAuthApi(skipDelay);
  const mealApi = getMealApi(mealsStart, skipDelay);
  const subscriptionApi = getSubscriptionApi(undefined, skipDelay);

  return {
    weeklyMenu: weeklyMenuApi,
    meal: mealApi,
    subscription: subscriptionApi,
    auth: authApi,
  };
}
