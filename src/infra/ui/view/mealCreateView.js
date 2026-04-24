import {createHeader} from '../ui-components/header.js';
import {createButton} from '../ui-components/button.js';
import {createMealFormHandler} from '../../handlers/mealHandlers.js';

export function mealCreateView(meal, dispatch) {
  const root = document.createElement('div');
  root.appendChild(createHeader('Nové jídlo', 'h2'));
  root.appendChild(
    createButton('Zpět na seznam', () => (window.location.hash = '#/meals')),
  );

  const form = document.createElement('form');

  form.appendChild(createField('name_cz', 'Název (CZ)', 'text', meal?.name?.cz ?? ''));
  form.appendChild(createField('name_en', 'Název (EN)', 'text', meal?.name?.en ?? ''));
  form.appendChild(createField('price', 'Cena (Kč)', 'number', meal?.price ?? 0));
  form.appendChild(createField('allergens', 'Alergeny (čísla oddělená čárkou)', 'text', ''));
  form.appendChild(createField('description', 'Popis', 'text', ''));

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Vytvořit jídlo';
  form.appendChild(submit);

  form.onsubmit = createMealFormHandler(dispatch);

  root.appendChild(form);
  return root;
}

function createField(name, label, type, value) {
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
