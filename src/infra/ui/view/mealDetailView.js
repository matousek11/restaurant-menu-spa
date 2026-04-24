import * as constants from '../../../constants.js';
import {createHeader} from '../ui-components/header.js';
import {createButton} from '../ui-components/button.js';
import {createParagraph} from '../ui-components/paragraph.js';
import {
  publishMealHandler,
  toggleMealAvailabilityHandler,
  updateMealFormHandler,
} from '../../handlers/mealHandlers.js';

export function mealDetailView(meal, dispatch) {
  const root = document.createElement('div');
  root.appendChild(createHeader('Detail jídla', 'h2'));
  root.appendChild(
    createButton('Zpět na seznam', () => (window.location.hash = '#/meals')),
  );

  if (!meal) {
    root.appendChild(createParagraph('Jídlo nenalezeno.'));
    return root;
  }

  const info = document.createElement('div');
  info.appendChild(createParagraph(`Název (CZ): ${meal.name?.cz ?? '—'}`));
  info.appendChild(createParagraph(`Název (EN): ${meal.name?.en ?? '—'}`));
  info.appendChild(createParagraph(`Cena: ${meal.price} Kč`));
  info.appendChild(createParagraph(`Alergeny: ${meal.allergens?.join(', ') || '—'}`));
  if (meal.description) {
    info.appendChild(createParagraph(`Popis: ${meal.description}`));
  }
  root.appendChild(info);

  if (meal.status === constants.MEAL_DRAFT) {
    root.appendChild(
      createButton('Publikovat', publishMealHandler(dispatch, meal.id)),
    );
    root.appendChild(createHeader('Upravit jídlo', 'h3'));
    root.appendChild(buildEditForm(meal, dispatch));
  } else {
    const label =
      meal.status === constants.MEAL_AVAILABLE ? 'Označit jako nedostupné' : 'Označit jako dostupné';
    root.appendChild(createButton(label, toggleMealAvailabilityHandler(dispatch, meal)));
  }

  return root;
}

function buildEditForm(meal, dispatch) {
  const form = document.createElement('form');

  form.appendChild(createField('name_cz', 'Název (CZ)', meal.name?.cz ?? ''));
  form.appendChild(createField('name_en', 'Název (EN)', meal.name?.en ?? ''));
  form.appendChild(createField('price', 'Cena (Kč)', meal.price ?? 0, 'number'));
  form.appendChild(
    createField('allergens', 'Alergeny', meal.allergens?.join(', ') ?? ''),
  );
  form.appendChild(createField('description', 'Popis', meal.description ?? ''));

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Uložit změny';
  form.appendChild(submit);

  form.onsubmit = updateMealFormHandler(dispatch, meal);

  return form;
}

function createField(name, label, value, type = 'text') {
  const wrapper = document.createElement('div');

  const labelEl = document.createElement('label');
  labelEl.htmlFor = name;
  labelEl.textContent = label;

  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.id = name;
  input.value = value;

  wrapper.appendChild(labelEl);
  wrapper.appendChild(input);
  return wrapper;
}
