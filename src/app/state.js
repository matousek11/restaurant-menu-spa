import * as constants from '../constants.js'

/**
 * @returns initial state of application
 */
export function createInitialState() {
    return {
        // domain data
        weeklyMenus: [],
        meals: [],
        allergens: [],

        // authorization
        auth: {role: constants.UNAUTHORIZED},

        // UI state
        ui: {
            view: constants.ACTION_CURRENT_WEEKLY_MENU,
            status: constants.LOADING,
            errorMessage: null,
            selectedModelId: null,
            selectedWeeklyMenuId: null,
            language: constants.LANG_ENGLISH,
        }
    }
}