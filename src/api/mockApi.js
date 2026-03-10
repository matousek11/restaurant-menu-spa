import {getWeeklyMenuApi} from './weeklyMenuApi';

/**
 * @param weeklyMenusStart initial state
 * @returns mock APIs for available entities
 */
export function getMockApi(weeklyMenusStart) {
  const weeklyMenuApi = getWeeklyMenuApi(weeklyMenusStart);

  return {
    weeklyMenu: weeklyMenuApi,
    meal: null,
    allergen: null,
    auth: null,
  };
}
