import * as constants from '../../constants.js';

export function removeMealFromMenuHandler(dispatch, weekStartId, dayId, mealId) {
  return function onClick(event) {
    event.preventDefault();
    dispatch({
      type: constants.ACTION_REMOVE_MEAL_FROM_MENU,
      payload: { weekStartId, dayId, mealId },
    });
  };
}

export function addMealFromTemplateHandler(dispatch, weeklyMenu, dayId, availableMeals) {
  return function onClick(selectedMealId) {
    const meal = availableMeals.find((m) => m.id === selectedMealId);
    if (!meal) return;
    dispatch({
      type: constants.ACTION_ADD_MEAL_TO_MENU,
      payload: {
        weekStartId: weeklyMenu.weekStartId,
        dayId,
        meal: {
          id: crypto.randomUUID(),
          templateId: meal.id,
          name: {
            cz: meal.name?.cz ?? meal.name?.en ?? '',
            en: meal.name?.en ?? meal.name?.cz ?? '',
          },
          price: meal.price ?? 0,
          allergens: meal.allergens ?? [],
          description: meal.description ?? null,
          status: meal.status ?? constants.MEAL_AVAILABLE,
        },
      },
    });
  };
}

export function addNewMealToMenuFormHandler(dispatch, weeklyMenu, dayId) {
  return function onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.elements['mealName'].value.trim();
    const price = parseInt(form.elements['mealPrice'].value, 10);
    if (!name || isNaN(price)) return;
    dispatch({
      type: constants.ACTION_ADD_MEAL_TO_MENU,
      payload: {
        weekStartId: weeklyMenu.weekStartId,
        dayId,
        meal: {
          id: crypto.randomUUID(),
          templateId: null,
          name: { cz: name, en: name },
          price,
          allergens: [],
          status: constants.MEAL_AVAILABLE,
        },
      },
    });
  };
}
