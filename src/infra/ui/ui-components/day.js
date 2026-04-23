import {createHeader} from './header.js';
import {getDayTranslation} from '../../../app/helpers/dateManipulation.js';

/**
 * Creates a day element with the given day.
 *
 * @param day day to display.
 *
 * @returns {HTMLDivElement} created day element.
 */
export function createDay(day) {
    const dayElement = document.createElement('div');
    dayElement.className = 'day-container';

    const dayName = createHeader(getDayTranslation(day.dayId));
    dayElement.appendChild(dayName);

    if (!day.meals || day.meals.length === 0) {
        const noMeals = document.createElement('p');
        noMeals.className = 'day-no-meals';
        noMeals.textContent = 'Žádná jídla';
        dayElement.appendChild(noMeals);
        return dayElement;
    }

    const mealList = document.createElement('ul');
    mealList.className = 'meal-list';

    for (const meal of day.meals) {
        const mealItem = document.createElement('li');
        mealItem.className = 'meal-item';
        mealItem.dataset.mealId = meal.id;

        // Meal name (use Czech name if available, fallback to English, then raw string)
        const mealName = document.createElement('span');
        mealName.className = 'meal-name';
        if (meal.name && typeof meal.name === 'object') {
            mealName.textContent = meal.name.cz || meal.name.en || 'Nepojmenované jídlo';
        } else if (typeof meal.name === 'string') {
            mealName.textContent = meal.name;
        } else {
            mealName.textContent = 'Nepojmenované jídlo';
        }
        mealItem.appendChild(mealName);

        // Meal price
        if (meal.price != null) {
            const mealPrice = document.createElement('span');
            mealPrice.className = 'meal-price';
            mealPrice.textContent = ` — ${meal.price} Kč`;
            mealItem.appendChild(mealPrice);
        }

        // Allergens
        if (meal.allergens && meal.allergens.length > 0) {
            const allergenSpan = document.createElement('span');
            allergenSpan.className = 'meal-allergens';
            allergenSpan.textContent = ` (alergeny: ${meal.allergens.join(', ')})`;
            mealItem.appendChild(allergenSpan);
        }

        mealList.appendChild(mealItem);
    }

    dayElement.appendChild(mealList);

    return dayElement;
}