import {getWeeklyMenuApi} from './weeklyMenuApi';

/**
 * @typedef {Object} MockApi
 * @property {import('./weeklyMenuApi').WeeklyMenuApi} weeklyMenu
 * @property {null} meal
 * @property {null} allergen
 * @property {null} auth
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

  return {
    weeklyMenu: weeklyMenuApi,
    meal: null,
    allergen: null,
    auth: null,
  };
}
