import {createButton} from '../ui-components/button.js';
import {createWeek} from '../ui-components/week.js';
import {MEAL_AVAILABLE} from '../../../constants.js';
import {
  removeMealFromMenuHandler,
  addMealFromTemplateHandler,
  addNewMealToMenuFormHandler,
  goToWeeklyMenuListHandler,
} from '../../handlers/weeklyMenuHandlers.js';

/**
 * Renders the weekly menu detail view with meal management controls.
 * Manager can add/remove meals for each day.
 *
 * @param {Object} weeklyMenu - the weekly menu data
 * @param {Object[]} availableMeals - meals from meal management
 * @param {Function} canDisplayStateChangeButtons - permission check for state transitions
 * @param {Function} canUpdateWeeklyMenu - permission check for editing
 * @param {Function} dispatch - the dispatcher function
 * @returns {HTMLElement}
 */
export function weeklyMenuDetailView(weeklyMenu, availableMeals, canDisplayStateChangeButtons, canUpdateWeeklyMenu, dispatch) {
  const root = document.createElement("div");

  const backButton = createButton('Zpět na seznam', goToWeeklyMenuListHandler());
  backButton.className = 'auth-btn auth-btn-home';
  root.appendChild(backButton);

  const weeklyMenuRender = createWeek(
    weeklyMenu,
    canDisplayStateChangeButtons,
    canUpdateWeeklyMenu,
    true,
    null,
    (originalWeekStartId, updatedWeekStartId) =>
      `#/weekly-menu-date/${encodeURIComponent(originalWeekStartId)}/${encodeURIComponent(updatedWeekStartId)}`,
    true,
  );
  root.appendChild(weeklyMenuRender);

  // Meal management section
  if (weeklyMenu) {
    const mealSection = document.createElement('div');
    mealSection.className = 'meal-management-section';

    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = 'Správa jídel';
    mealSection.appendChild(sectionTitle);

    // Create a meal management panel for each day (0-6)
    for (let dayId = 0; dayId < 7; dayId++) {
      const dayPanel = createDayMealPanel(
        weeklyMenu,
        dayId,
        availableMeals,
        dispatch,
        canUpdateWeeklyMenu(weeklyMenu.state),
      );
      mealSection.appendChild(dayPanel);
    }

    root.appendChild(mealSection);
  }

  return root;
}

/**
 * Creates a panel for managing meals on a specific day.
 *
 * @param {Object} weeklyMenu - the weekly menu data
 * @param {number} dayId - the day index (0-6)
 * @param {Object[]} availableMeals - meals from meal management
 * @param {Function} dispatch - the dispatcher function
 * @param {boolean} isEditable - whether the menu can be edited
 *
 * @returns {HTMLElement}
 */
function createDayMealPanel(weeklyMenu, dayId, availableMeals, dispatch, isEditable) {
  const dayNames = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];
  const panel = document.createElement('div');
  panel.className = 'day-meal-panel';

  const dayTitle = document.createElement('h3');
  dayTitle.textContent = dayNames[dayId];
  panel.appendChild(dayTitle);

  // Show existing meals with remove buttons
  const day = weeklyMenu.days ? weeklyMenu.days.find(d => d.dayId === dayId) : null;
  const meals = day ? day.meals : [];

  if (meals.length > 0) {
    const mealList = document.createElement('ul');
    mealList.className = 'day-meal-list';

    for (const meal of meals) {
      const li = document.createElement('li');
      li.className = 'day-meal-item';

      const nameSpan = document.createElement('span');
      if (meal.name && typeof meal.name === 'object') {
        nameSpan.textContent = `${meal.name.cz || meal.name.en || 'Bez názvu'} - ${meal.price || 0} Kč`;
      } else {
        nameSpan.textContent = `${meal.name || 'Bez názvu'} - ${meal.price || 0} Kč`;
      }
      li.appendChild(nameSpan);

      if (isEditable) {
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Odebrat';
        removeBtn.className = 'meal-remove-btn';
        removeBtn.onclick = removeMealFromMenuHandler(dispatch, weeklyMenu.weekStartId, dayId, meal.id);
        li.appendChild(removeBtn);
      }

      mealList.appendChild(li);
    }
    panel.appendChild(mealList);
  } else {
    const noMeals = document.createElement('p');
    noMeals.className = 'day-no-meals';
    noMeals.textContent = 'Žádná jídla';
    panel.appendChild(noMeals);
  }

  if (!isEditable) {
    return panel;
  }

  // --- Add Meal Form ---
  const form = document.createElement('form');
  form.className = 'add-meal-form';

  const managedMeals = Array.isArray(availableMeals)
    ? availableMeals.filter((meal) => meal && meal.name && meal.status === MEAL_AVAILABLE)
    : [];

  const savedMealSelect = document.createElement('select');
  savedMealSelect.className = 'meal-select';
  const savedMealDefaultOption = document.createElement('option');
  savedMealDefaultOption.value = '';
  savedMealDefaultOption.textContent = 'Vyber jídlo ze správy jídel';
  savedMealSelect.appendChild(savedMealDefaultOption);

  for (const managedMeal of managedMeals) {
    const option = document.createElement('option');
    option.value = managedMeal.id;
    option.textContent = `${managedMeal.name?.cz || managedMeal.name?.en || 'Bez názvu'} - ${managedMeal.price || 0} Kč`;
    savedMealSelect.appendChild(option);
  }
  form.appendChild(savedMealSelect);

  const addFromTemplate = addMealFromTemplateHandler(dispatch, weeklyMenu, dayId, managedMeals);
  const addExistingMeal = () => {
    if (!savedMealSelect.value) {
      return;
    }

    addFromTemplate(savedMealSelect.value);
    savedMealSelect.value = '';
  };

  const addSavedMealButton = createButton(
    '+ Přidat vybrané jídlo',
    addExistingMeal,
    'meal-add-btn',
  );
  form.appendChild(addSavedMealButton);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'mealName';
  nameInput.placeholder = 'Název jídla';
  nameInput.className = 'meal-input';
  nameInput.required = true;
  form.appendChild(nameInput);

  const priceInput = document.createElement('input');
  priceInput.type = 'number';
  priceInput.name = 'mealPrice';
  priceInput.placeholder = 'Cena (Kč)';
  priceInput.className = 'meal-input';
  priceInput.min = '0';
  priceInput.required = true;
  form.appendChild(priceInput);

  const addBtn = document.createElement('button');
  addBtn.type = 'submit';
  addBtn.textContent = '+ Přidat jídlo';
  addBtn.className = 'meal-add-btn';
  form.appendChild(addBtn);

  form.onsubmit = addNewMealToMenuFormHandler(dispatch, weeklyMenu, dayId);

  panel.appendChild(form);

  return panel;
}