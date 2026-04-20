import {createButton} from '../ui-components/button.js';
import {createHeader} from '../ui-components/header.js';
import {createParagraph} from '../ui-components/paragraph.js';

/**
 * List of all weekly menus
 *
 * @param {Array<{ weekStartId: string, state?: string }>} weeklyMenus
 * @param {(action: { type: string, payload?: object }) => void} dispatch
 *
 * @returns {HTMLDivElement}
 */
export function weeklyMenuListView(weeklyMenus, dispatch) {
  const root = document.createElement('div');
  root.appendChild(createHeader('Týdenní menu', 'h2'));
  const weeklyMenuCreateButton = createButton(
    'Nové týdenní menu',
    () => window.location.hash = '#/create-weekly-menu',
  )
  root.appendChild(weeklyMenuCreateButton);

  if (!weeklyMenus?.length) {
    root.appendChild(createParagraph('Žádná týdenní menu.'));
    return root;
  }

  const list = document.createElement('ul');

  for (const menu of weeklyMenus) {
    const item = document.createElement('li');
    const info = document.createElement('div');

    const dateLabel = document.createElement('span');
    dateLabel.textContent = menu.weekStartId;

    const stateLabel = document.createElement('span');
    stateLabel.textContent = menu.state ? ` (${menu.state})` : '';

    info.appendChild(dateLabel);
    info.appendChild(stateLabel);

    const actions = document.createElement('div');
    const weekStartId = menu.weekStartId;

    actions.appendChild(
      createButton('Zobrazit', () =>
        window.location.hash = `#/weekly-menu/${encodeURIComponent(weekStartId)}`
      ),
    );
    actions.appendChild(
      createButton('Smazat', () =>
        window.location.hash = `#/delete-weekly-menu/${encodeURIComponent(weekStartId)}`
      ),
    );

    item.appendChild(info);
    item.appendChild(actions);
    list.appendChild(item);
  }

  root.appendChild(list);
  return root;
}
