import {createButton} from '../ui-components/button.js';
import {createWeek} from '../ui-components/week.js';
import {goToWeeklyMenuListHandler} from '../../handlers/weeklyMenuHandlers.js';

export function weeklyMenuCreateView(weeklyMenu) {
  const root = document.createElement('div');

  const backButton = createButton('back', goToWeeklyMenuListHandler());
  root.appendChild(backButton);

  const weeklyMenuRender = createWeek(
    weeklyMenu,
    () => false,
    () => true,
    true,
    (_, selectedWeekStartId) =>
      `#/create-weekly-menu/${encodeURIComponent(selectedWeekStartId)}`,
    null,
  );
  root.appendChild(weeklyMenuRender);

  return root;
}
