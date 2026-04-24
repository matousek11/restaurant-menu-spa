import * as constants from '../../constants.js';

/**
 * Returns an onSubmit handler for the "create meal" form.
 * Reads name (cz/en), price, allergens from the form and dispatches ACTION_MAKE_MEAL_CREATE.
 *
 * @param {Function} dispatch
 * @returns {(event: SubmitEvent) => void}
 */
export function createMealFormHandler(dispatch) {
  return function onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const meal = {
      id: crypto.randomUUID(),
      name: {
        cz: form.elements['name_cz'].value,
        en: form.elements['name_en'].value,
      },
      price: Number(form.elements['price'].value),
      allergens: parseAllergensField(form.elements['allergens']?.value),
      description: form.elements['description']?.value || null,
    };
    dispatch({type: constants.ACTION_MAKE_MEAL_CREATE, payload: {meal}});
  };
}

/**
 * Returns an onClick handler that publishes a meal (DRAFT -> AVAILABLE).
 *
 * @param {Function} dispatch
 * @param {string} mealId
 * @returns {(event: MouseEvent) => void}
 */
export function publishMealHandler(dispatch, mealId) {
  return function onClick(event) {
    event.preventDefault();
    dispatch({type: constants.ACTION_MAKE_MEAL_PUBLISH, payload: {mealId}});
  };
}

/**
 * Returns an onClick handler that toggles meal availability (AVAILABLE <-> UNAVAILABLE).
 *
 * @param {Function} dispatch
 * @param {{ id: string, status: string }} meal
 * @returns {(event: MouseEvent) => void}
 */
export function toggleMealAvailabilityHandler(dispatch, meal) {
  return function onClick(event) {
    event.preventDefault();
    if (meal.status === constants.MEAL_AVAILABLE) {
      dispatch({type: constants.ACTION_MAKE_MEAL_MARK_UNAVAILABLE, payload: {mealId: meal.id}});
    } else if (meal.status === constants.MEAL_UNAVAILABLE) {
      dispatch({type: constants.ACTION_MAKE_MEAL_MARK_AVAILABLE, payload: {mealId: meal.id}});
    }
  };
}

/**
 * Returns an onSubmit handler for the "edit meal" form.
 *
 * @param {Function} dispatch
 * @param {{ id: string, status: string }} meal
 * @returns {(event: SubmitEvent) => void}
 */
export function updateMealFormHandler(dispatch, meal) {
  return function onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const updated = {
      ...meal,
      name: {
        cz: form.elements['name_cz'].value,
        en: form.elements['name_en'].value,
      },
      price: Number(form.elements['price'].value),
      allergens: parseAllergensField(form.elements['allergens']?.value),
      description: form.elements['description']?.value || null,
    };
    dispatch({type: constants.ACTION_MAKE_MEAL_UPDATE, payload: {meal: updated}});
  };
}

/**
 * Parses a comma-separated string of allergen numbers into an array of integers.
 * Returns an empty array for empty/undefined input.
 *
 * @param {string | undefined} value
 * @returns {number[]}
 */
function parseAllergensField(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));
}
