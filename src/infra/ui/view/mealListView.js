import * as constants from '../../../constants.js';
import {createButton} from '../ui-components/button.js';
import {createHeader} from '../ui-components/header.js';
import {createParagraph} from '../ui-components/paragraph.js';
import {createMealCard} from '../ui-components/meal.js';
import {publishMealHandler, toggleMealAvailabilityHandler} from '../../handlers/mealHandlers.js';

export function mealListView(meals, dispatch) {
  const root = document.createElement('div');
  root.appendChild(createHeader('Jídla', 'h2'));
  root.appendChild(
    createButton('← Zpět na týdenní menu', () => (window.location.hash = '#/weekly-menu')),
  );
  root.appendChild(
    createButton('Nové jídlo', () => (window.location.hash = '#/create-meal')),
  );

  if (!meals?.length) {
    root.appendChild(createParagraph('Žádná jídla.'));
    return root;
  }

  const list = document.createElement('ul');

  for (const meal of meals) {
    const item = document.createElement('li');

    const card = createMealCard(meal);
    card.style.cursor = 'pointer';
    card.onclick = () => (window.location.hash = `#/meals/${encodeURIComponent(meal.id)}`);

    const actions = document.createElement('div');

    if (meal.status === constants.MEAL_DRAFT) {
      actions.appendChild(
        createButton('Publikovat', publishMealHandler(dispatch, meal.id)),
      );
    } else {
      const label =
        meal.status === constants.MEAL_AVAILABLE ? 'Označit jako nedostupné' : 'Označit jako dostupné';
      actions.appendChild(
        createButton(label, toggleMealAvailabilityHandler(dispatch, meal)),
      );
    }

    item.appendChild(card);
    item.appendChild(actions);
    list.appendChild(item);
  }

  root.appendChild(list);
  return root;
}
