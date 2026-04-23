import { createButton } from '../ui-components/button.js';
import { createHeader } from '../ui-components/header.js';
import { createParagraph } from '../ui-components/paragraph.js';

/**
 * Seznam předplatných přihlášeného zákazníka.
 *
 * @param {{ subscriptions: Array, canCreate: boolean }} viewState
 * @returns {HTMLDivElement}
 */
export function subscriptionListView(viewState) {
  const root = document.createElement('div');

  root.appendChild(
    createButton('← Zpět na menu', () => {
      window.location.hash = '#/';
    }),
  );

  root.appendChild(createHeader('Moje předplatná', 'h2'));

  const createBtn = createButton('+ Nové předplatné', () => {
    window.location.hash = '#/subscriptions/create';
  });
  if (!viewState.canCreate) createBtn.disabled = true;
  root.appendChild(createBtn);

  const subscriptions = viewState.subscriptions ?? [];
  if (subscriptions.length === 0) {
    root.appendChild(createParagraph('Žádná předplatná.'));
    return root;
  }

  const list = document.createElement('ul');
  for (const s of subscriptions) {
    const item = document.createElement('li');

    const label = document.createElement('span');
    label.textContent = `Týden od ${s.weekStartId} — ${s.status} (${s.remainingDays}/${s.totalDays} dnů)`;
    item.appendChild(label);

    item.appendChild(
      createButton('Detail', () => {
        window.location.hash = `#/subscriptions/${encodeURIComponent(s.id)}`;
      }),
    );

    list.appendChild(item);
  }
  root.appendChild(list);

  return root;
}
