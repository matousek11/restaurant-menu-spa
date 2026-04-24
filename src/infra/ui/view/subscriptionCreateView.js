import { createButton } from '../ui-components/button.js';
import { createHeader } from '../ui-components/header.js';
import { createParagraph } from '../ui-components/paragraph.js';
import { ACTION_CREATE_SUBSCRIPTION } from '../../../constants.js';

/**
 * Formulář pro vytvoření nového předplatného.
 *
 * @param {{ canCreate: boolean }} viewState
 * @param {(action: { type: string, payload?: object }) => void} dispatch
 * @returns {HTMLDivElement}
 */
export function subscriptionCreateView(viewState, dispatch) {
  const root = document.createElement('div');

  root.appendChild(
    createButton('← Zpět na seznam', () => {
      window.location.hash = '#/subscriptions';
    }),
  );

  root.appendChild(createHeader('Nové předplatné', 'h2'));

  if (!viewState.canCreate) {
    root.appendChild(
      createParagraph(
        'Nelze vytvořit: již máte aktivní nebo pozastavené předplatné.',
      ),
    );
    return root;
  }

  const publishedMenus = viewState.publishedWeeklyMenus ?? [];
  if (publishedMenus.length === 0) {
    root.appendChild(createParagraph('Nelze vytvořit: žádné publikované týdenní menu není k dispozici.'));
    return root;
  }

  const form = document.createElement('form');

  const weekLabel = document.createElement('label');
  weekLabel.textContent = 'Týden: ';
  const weekSelect = document.createElement('select');
  weekSelect.required = true;
  for (const menu of publishedMenus) {
    const option = document.createElement('option');
    option.value = menu.weekStartId;
    option.textContent = `Týden od ${menu.weekStartId}`;
    weekSelect.appendChild(option);
  }
  weekLabel.appendChild(weekSelect);
  form.appendChild(weekLabel);

  const daysLabel = document.createElement('label');
  daysLabel.textContent = ' Počet dnů: ';
  const daysInput = document.createElement('input');
  daysInput.type = 'number';
  daysInput.min = '1';
  daysInput.value = '30';
  daysInput.required = true;
  daysLabel.appendChild(daysInput);
  form.appendChild(daysLabel);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Vytvořit';
  form.appendChild(submit);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const weekStartId = weekSelect.value;
    const totalDays = parseInt(daysInput.value, 10);
    if (!weekStartId || Number.isNaN(totalDays)) return;
    dispatch({
      type: ACTION_CREATE_SUBSCRIPTION,
      payload: { weekStartId, totalDays },
    });
  });

  root.appendChild(form);
  return root;
}
