/**
 * @typedef {Object} WeeklyMenuApi
 * @property {(weeklyMenu: any) => Promise<any | null>} addWeeklyMenu
 * @property {(updatedWeeklyMenu: any) => Promise<any | null>} updateWeeklyMenu
 * @property {() => Promise<any[]>} getWeeklyMenus
 * @property {(weekStartId: string) => Promise<any | null>} getWeeklyMenu
 * @property {(weekStartId: string) => Promise<boolean>} removeWeeklyMenu
 * @property {(weeklyMenuId: string, dayId: string, mealId: string) => Promise<any>} addTemplateMealToWeeklyMenu
 * @property {(weeklyMenuId: string, dayId: string, mealId: string) => Promise<boolean>} removeTemplateMealFromWeeklyMenu
 * @property {(weeklyMenuId: string, dayId: string, meal: any) => Promise<any | null>} addMealToWeeklyMenu
 * @property {(weeklyMenuId: string, dayId: string, meal: any) => Promise<any | null>} updateMealInWeeklyMenu
 * @property {(weeklyMenuId: string, dayId: string, mealId: string) => Promise<boolean>} removeMealFromWeeklyMenu
 */

/**
 * Offer mocked API for a weekly menu.
 *
 * @param {any[]} weeklyMenusStart Initial state of a database
 * @param {boolean} skipDelay when true delays simulating async
 * communication is skipped
 * @returns {WeeklyMenuApi} api endpoints for a weekly menu
 */
export function getWeeklyMenuApi(
  weeklyMenusStart,
  skipDelay = false,
) {
  let liveWeeklyMenus = structuredClone(weeklyMenusStart);

  /**
   * Adds a new weekly menu and return all weekly menus.
   *
   * @param weeklyMenu full weekly menu object
   * @returns {Promise<any | null>} added weekly menu or null when
   * a weekly menu already exists in selected week
   */
  async function addWeeklyMenu(weeklyMenu) {
    await delay();

    const weekStartId = weeklyMenu.weekStartId;
    if (liveWeeklyMenus.some((weeklyMenu) => weeklyMenu.weekStartId === weekStartId)) {
      return null;
    }

    liveWeeklyMenus.push(weeklyMenu);

    return structuredClone(weeklyMenu);
  }

  /**
   * Updates a weekly menu and return all weekly menus.
   *
   * @param updatedWeeklyMenu new version of a weekly menu with same weekStartId
   * @returns {Promise<any | null>} updated weekly menu when successful,
   * when a weekly menu not found null is returned
   */
  async function updateWeeklyMenu(updatedWeeklyMenu) {
    await delay();

    const index = liveWeeklyMenus.findIndex(
      (weeklyMenu) => weeklyMenu.weekStartId === updatedWeeklyMenu.weekStartId,
    );

    if (index === -1) {
      return null;
    }

    liveWeeklyMenus[index] = updatedWeeklyMenu;
    return structuredClone(updatedWeeklyMenu);
  }

  /**
   * Loads all weekly menus.
   *
   * @returns all weekly menus
   */
  async function getWeeklyMenus() {
    await delay();

    return structuredClone(liveWeeklyMenus);
  }

  /**
   * Load a specific weekly menu by id
   *
   * @param weekStartId id of the weekly menu to be loaded ("2026-02-16")
   * @returns selected weekly menu or null if not found.
   */
  async function getWeeklyMenu(weekStartId) {
    await delay();

    for (let i = 0; i < liveWeeklyMenus.length; i++) {
      if (liveWeeklyMenus[i].weekStartId === weekStartId) {
        return structuredClone(liveWeeklyMenus[i]);
      }
    }

    return null;
  }

  /**
   * Deletes a weekly menu with selected id.
   *
   * @param weekStartId id of the weekly menu to be deleted ("2026-02-16")
   * @returns {Promise<boolean>} Returns true when deleted
   * or false when no weekly menu deleted.
   */
  async function removeWeeklyMenu(weekStartId) {
    await delay();

    let lengthBeforeDelete = liveWeeklyMenus.length;
    liveWeeklyMenus = liveWeeklyMenus.filter(
      (weeklyMenu) => weeklyMenu.weekStartId !== weekStartId,
    );

    return lengthBeforeDelete - liveWeeklyMenus.length !== 0;
  }

  /**
   * Adds template meal to the weekly menu with selected id.
   *
   * @param weeklyMenuId id of the weekly menu to be deleted ("2026-02-16")
   * @param dayId ID of a day in which meal should be
   * @param mealId ID of a template meal to add
   * @returns {Promise<any>} added meal
   */
  async function addTemplateMealToWeeklyMenu(weeklyMenuId, dayId, mealId) {
    // TODO: Add when meal structure is ready
  }

  /**
   * Remove the template meal from the weekly menu with selected id.
   *
   * @param weeklyMenuId id of the weekly menu to be deleted ("2026-02-16")
   * @param dayId ID of a day in which meal should be
   * @param mealId ID of a template meal to remove
   * @returns {Promise<boolean>} true when meal removed, otherwise false
   */
  async function removeTemplateMealFromWeeklyMenu(weeklyMenuId, dayId, mealId) {
    // TODO: Add when meal structure is ready
  }

  /**
   * Adds meal to the weekly menu with selected id.
   *
   * @param weeklyMenuId id of the weekly menu to be deleted ("2026-02-16")
   * @param dayId ID of a day in which meal should be
   * @param meal Meal that is going to be added to the weekly menu
   * @returns {Promise<any | null>} added meal when added, null otherwise
   */
  async function addMealToWeeklyMenu(weeklyMenuId, dayId, meal) {
    // TODO: Add when meal structure is ready
  }

  /**
   * Updates meal in the weekly menu with selected id.
   *
   * @param weeklyMenuId id of the weekly menu to be deleted ("2026-02-16")
   * @param dayId ID of a day in which meal should be
   * @param meal new version of meal that is going to the weekly menu
   * @returns {Promise<any | null>} if updated meal is returned, otherwise null
   */
  async function updateMealInWeeklyMenu(weeklyMenuId, dayId, meal) {
    // TODO: Add when meal structure is ready
  }

  /**
   * Remove meal from the weekly menu with selected id.
   *
   * @param weeklyMenuId id of the weekly menu to be deleted ("2026-02-16")
   * @param dayId ID of a day in which meal should be
   * @param mealId Meal that is going to be added to the weekly menu
   * @returns {Promise<boolean>} true when meal removed, false otherwise
   */
  async function removeMealFromWeeklyMenu(weeklyMenuId, dayId, mealId) {
    // TODO: Add when meal structure is ready
  }

  function delay(ms = 400) {
    const finalDelay = skipDelay ? 0 : ms;

    return new Promise((resolve) => setTimeout(resolve, finalDelay));
  }

  return {
    addWeeklyMenu,
    updateWeeklyMenu,
    getWeeklyMenus,
    getWeeklyMenu,
    removeWeeklyMenu,
    addTemplateMealToWeeklyMenu,
    removeTemplateMealFromWeeklyMenu,
    addMealToWeeklyMenu,
    updateMealInWeeklyMenu,
    removeMealFromWeeklyMenu,
  };
}
