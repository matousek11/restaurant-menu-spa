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

    const dayName = createHeader(getDayTranslation(day.dayId));
    dayElement.appendChild(dayName);

    const foodName = document.createElement('p');
    foodName.textContent = 'foodName';

    // TODO: meals are going to be added here
    const meals = day.meals.map((meal) => foodName);
    if (meals.length === 0) {
        return dayElement;
    }

    dayElement.appendChild(...meals);

    return dayElement;
}