import * as constants from '../../constants.js';

export function createMeal(data) {
  return {
    id: data.id,
    status: constants.MEAL_DRAFT,
    name: data.name,
    price: data.price,
    allergens: data.allergens ?? [],
    description: data.description ?? null,
  };
}

export function publishMeal(meal) {
  if (meal.status !== constants.MEAL_DRAFT) {
    return meal;
  }
  if (!meal.name || !meal.price) {
    return meal;
  }
  return {
    ...meal,
    status: constants.MEAL_AVAILABLE,
  };
}

export function markMealUnavailable(meal) {
  if (meal.status !== constants.MEAL_AVAILABLE) {
    return meal;
  }
  return {
    ...meal,
    status: constants.MEAL_UNAVAILABLE,
  };
}

export function markMealAvailable(meal) {
  if (meal.status !== constants.MEAL_UNAVAILABLE) {
    return meal;
  }
  return {
    ...meal,
    status: constants.MEAL_AVAILABLE,
  };
}
