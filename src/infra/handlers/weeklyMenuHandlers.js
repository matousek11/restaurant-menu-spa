import * as constants from '../../constants.js';
import {getMondayDateOfWeek} from '../../app/helpers/dateManipulation.js';

export function goToWeeklyMenuListHandler() {
  return function onClick() {
    window.location.hash = '#/weekly-menu';
  };
}

export function goToWeeklyMenuCreateHandler() {
  return function onClick() {
    window.location.hash = '#/create-weekly-menu';
  };
}

export function goToWeeklyMenuDetailHandler(weekStartId) {
  return function onClick() {
    window.location.hash = `#/weekly-menu/${encodeURIComponent(weekStartId)}`;
  };
}

export function goToWeeklyMenuDeleteHandler(weekStartId) {
  return function onClick() {
    window.location.hash = `#/delete-weekly-menu/${encodeURIComponent(weekStartId)}`;
  };
}

export function createWeeklyMenuStateChangeHandler(weekStartId, newState) {
  return function onClick() {
    window.location.hash = `#/weekly-menu-state/${weekStartId}/${newState}`;
  };
}

export function createWeeklyMenuDateChangeHandler(weekStartId, buildDateChangeRoute, dateInput) {
  return function onChange(event) {
    const updatedWeekStartId = event.target.value;
    if (!updatedWeekStartId) {
      return;
    }

    const normalizedWeekStartId = getMondayDateOfWeek(updatedWeekStartId);
    dateInput.value = normalizedWeekStartId;
    window.location.hash = buildDateChangeRoute(weekStartId, normalizedWeekStartId);
  };
}

export function createWeeklyMenuSaveHandler(weekStartId, buildSaveRoute, dateInput) {
  return function onClick() {
    const currentDateValue = getMondayDateOfWeek(dateInput.value || weekStartId);
    dateInput.value = currentDateValue;
    window.location.hash = buildSaveRoute(weekStartId, currentDateValue);
  };
}

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
    if (!meal) {
      return;
    }

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
    if (!name || isNaN(price)) {
      return;
    }

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
