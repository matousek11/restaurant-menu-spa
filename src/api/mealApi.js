import {publishMeal, markMealUnavailable, markMealAvailable} from '../app/meal/mealTransitions.js';

/**
 * @typedef {Object} MealApi
 * @property {() => Promise<any[]>} getMeals
 * @property {(id: string) => Promise<any | null>} getMeal
 * @property {(meal: any) => Promise<any>} addMeal
 * @property {(meal: any) => Promise<any | null>} updateMeal
 * @property {(id: string) => Promise<boolean>} deleteMeal
 * @property {(id: string) => Promise<any | null>} publishMeal
 * @property {(id: string) => Promise<any | null>} markMealUnavailable
 * @property {(id: string) => Promise<any | null>} markMealAvailable
 */

/**
 * @param {any[]} mealsStart Initial state of the meals database
 * @param {boolean} skipDelay
 * @returns {MealApi}
 */
export function getMealApi(mealsStart, skipDelay = false) {
  let liveMeals = structuredClone(mealsStart);

  async function getMeals() {
    await delay();
    return structuredClone(liveMeals);
  }

  async function getMeal(id) {
    await delay();
    const meal = liveMeals.find((m) => m.id === id);
    return meal ? structuredClone(meal) : null;
  }

  async function addMeal(meal) {
    await delay();
    liveMeals.push(meal);
    return structuredClone(meal);
  }

  async function updateMeal(updatedMeal) {
    await delay();
    const index = liveMeals.findIndex((m) => m.id === updatedMeal.id);
    if (index === -1) {
      return null;
    }
    liveMeals[index] = updatedMeal;
    return structuredClone(updatedMeal);
  }

  async function deleteMeal(id) {
    await delay();
    const lengthBefore = liveMeals.length;
    liveMeals = liveMeals.filter((m) => m.id !== id);
    return liveMeals.length !== lengthBefore;
  }

  async function publishMealById(id) {
    await delay();
    const index = liveMeals.findIndex((m) => m.id === id);
    if (index === -1) {
      return null;
    }
    const updated = publishMeal(liveMeals[index]);
    liveMeals[index] = updated;
    return structuredClone(updated);
  }

  async function markMealUnavailableById(id) {
    await delay();
    const index = liveMeals.findIndex((m) => m.id === id);
    if (index === -1) {
      return null;
    }
    const updated = markMealUnavailable(liveMeals[index]);
    liveMeals[index] = updated;
    return structuredClone(updated);
  }

  async function markMealAvailableById(id) {
    await delay();
    const index = liveMeals.findIndex((m) => m.id === id);
    if (index === -1) {
      return null;
    }
    const updated = markMealAvailable(liveMeals[index]);
    liveMeals[index] = updated;
    return structuredClone(updated);
  }

  function delay(ms = 400) {
    const finalDelay = skipDelay ? 0 : ms;
    return new Promise((resolve) => setTimeout(resolve, finalDelay));
  }

  return {
    getMeals,
    getMeal,
    addMeal,
    updateMeal,
    deleteMeal,
    publishMeal: publishMealById,
    markMealUnavailable: markMealUnavailableById,
    markMealAvailable: markMealAvailableById,
  };
}
