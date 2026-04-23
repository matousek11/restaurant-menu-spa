import {createButton} from '../ui-components/button.js';
import {createWeek} from '../ui-components/week.js';
import {ACTION_ADD_MEAL_TO_MENU, ACTION_REMOVE_MEAL_FROM_MENU, MEAL_DRAFT, MEAL_AVAILABLE} from '../../../constants.js';

/**
 * Renders the weekly menu detail view with meal management controls.
 * Manager can add/remove meals for each day.
 *
 * @param {Object} weeklyMenu - the weekly menu data
 * @param {Function} canDisplayStateChangeButtons - permission check for state transitions
 * @param {Function} canUpdateWeeklyMenu - permission check for editing
 * @param {Function} dispatch - the dispatcher function
 * @returns {HTMLElement}
 */
export function weeklyMenuDetailView(weeklyMenu, canDisplayStateChangeButtons, canUpdateWeeklyMenu, dispatch) {
  const root = document.createElement("div");

  const backButton = createButton(
    '← Zpět na seznam', () => window.location.hash = '#/weekly-menu'
  );
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
    true, // skipDaysList — days are managed via the Správa jídel section below
  );
  root.appendChild(weeklyMenuRender);

  // --- Meal Management Section (only if menu exists and is editable) ---
  if (weeklyMenu && canUpdateWeeklyMenu && canUpdateWeeklyMenu(weeklyMenu.state)) {
    const mealSection = document.createElement('div');
    mealSection.className = 'meal-management-section';

    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = 'Správa jídel';
    mealSection.appendChild(sectionTitle);

    // Create a meal management panel for each day (0-6)
    for (let dayId = 0; dayId < 7; dayId++) {
      const dayPanel = createDayMealPanel(weeklyMenu, dayId, dispatch);
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
 * @param {Function} dispatch - the dispatcher function
 * @returns {HTMLElement}
 */
function createDayMealPanel(weeklyMenu, dayId, dispatch) {
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
        nameSpan.textContent = `${meal.name.cz || meal.name.en || 'Bez názvu'} — ${meal.price || 0} Kč`;
      } else {
        nameSpan.textContent = `${meal.name || 'Bez názvu'} — ${meal.price || 0} Kč`;
      }
      li.appendChild(nameSpan);

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✕ Odebrat';
      removeBtn.className = 'meal-remove-btn';
      removeBtn.onclick = () => {
        dispatch({
          type: ACTION_REMOVE_MEAL_FROM_MENU,
          payload: {
            weekStartId: weeklyMenu.weekStartId,
            dayId: dayId,
            mealId: meal.id,
          }
        });
      };
      li.appendChild(removeBtn);

      mealList.appendChild(li);
    }
    panel.appendChild(mealList);
  } else {
    const noMeals = document.createElement('p');
    noMeals.className = 'day-no-meals';
    noMeals.textContent = 'Žádná jídla';
    panel.appendChild(noMeals);
  }

  // --- Add Meal Form ---
  const form = document.createElement('form');
  form.className = 'add-meal-form';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Název jídla';
  nameInput.className = 'meal-input';
  nameInput.required = true;
  form.appendChild(nameInput);

  const priceInput = document.createElement('input');
  priceInput.type = 'number';
  priceInput.placeholder = 'Cena (Kč)';
  priceInput.className = 'meal-input';
  priceInput.min = '0';
  priceInput.required = true;
  form.appendChild(priceInput);

  const stateSelect = document.createElement('select');
  stateSelect.className = 'meal-select';
  const optDraft = document.createElement('option');
  optDraft.value = MEAL_DRAFT;
  optDraft.textContent = 'Draft';
  const optAvailable = document.createElement('option');
  optAvailable.value = MEAL_AVAILABLE;
  optAvailable.textContent = 'Available';
  stateSelect.appendChild(optDraft);
  stateSelect.appendChild(optAvailable);
  form.appendChild(stateSelect);

  const addBtn = document.createElement('button');
  addBtn.type = 'submit';
  addBtn.textContent = '+ Přidat jídlo';
  addBtn.className = 'meal-add-btn';
  form.appendChild(addBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const mealName = nameInput.value.trim();
    const mealPrice = parseInt(priceInput.value, 10);

    if (!mealName || isNaN(mealPrice)) return;

    const meal = {
      id: crypto.randomUUID(),
      templateId: null,
      name: { cz: mealName, en: mealName },
      price: mealPrice,
      allergens: [],
      status: stateSelect.value,
    };

    dispatch({
      type: ACTION_ADD_MEAL_TO_MENU,
      payload: {
        weekStartId: weeklyMenu.weekStartId,
        dayId: dayId,
        meal: meal,
      }
    });
  });

  panel.appendChild(form);

  return panel;
}