import * as constants from '../../constants.js';

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

export function publishMealHandler(dispatch, mealId) {
  return function onClick(event) {
    event.preventDefault();
    dispatch({type: constants.ACTION_MAKE_MEAL_PUBLISH, payload: {mealId}});
  };
}

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

function parseAllergensField(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));
}
