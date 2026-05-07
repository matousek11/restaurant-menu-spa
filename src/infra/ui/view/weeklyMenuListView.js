import {createButton} from '../ui-components/button.js';
import {createHeader} from '../ui-components/header.js';
import {createParagraph} from '../ui-components/paragraph.js';
import {
  goToArchivedWeeklyMenuListHandler,
  goToWeeklyMenuListHandler,
  goToWeeklyMenuCreateHandler,
  goToWeeklyMenuDeleteHandler,
  goToWeeklyMenuDetailHandler,
} from '../../handlers/weeklyMenuHandlers.js';

/**
 * List of all weekly menus
 *
 * @param {Array<{ weekStartId: string, state?: string }>} weeklyMenus
 * @param {(action: { type: string, payload?: object }) => void} dispatch
 * @param {boolean} isArchivedList whether to show archived weekly menus only
 *
 * @returns {HTMLDivElement}
 */
export function weeklyMenuListView(weeklyMenus, dispatch, isArchivedList = false) {
  const root = document.createElement('div');
  root.appendChild(createHeader(isArchivedList ? 'Archivovaná týdenní menu' : 'Týdenní menu', 'h2'));

  if (isArchivedList) {
    root.appendChild(createButton('Všechna menu', goToWeeklyMenuListHandler()));
  } else {
    root.appendChild(createButton('Archivovaná menu', goToArchivedWeeklyMenuListHandler()));
    root.appendChild(
      createButton('Nové týdenní menu', goToWeeklyMenuCreateHandler()),
    );
    root.appendChild(
      createButton('Správa jídel', () => window.location.hash = '#/meals'),
    );
  }

  if (!weeklyMenus?.length) {
    root.appendChild(
      createParagraph(isArchivedList ? 'Žádná archivovaná týdenní menu.' : 'Žádná týdenní menu.'),
    );
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
      createButton('Zobrazit', goToWeeklyMenuDetailHandler(weekStartId)),
    );
    actions.appendChild(
      createButton('Smazat', goToWeeklyMenuDeleteHandler(weekStartId)),
    );

    item.appendChild(info);
    item.appendChild(actions);
    list.appendChild(item);
  }

  root.appendChild(list);
  return root;
}
