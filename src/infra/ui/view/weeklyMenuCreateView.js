import {createButton} from '../ui-components/button.js';
import {createWeek} from '../ui-components/week.js';

export function weeklyMenuCreateView(weeklyMenu) {
  const root = document.createElement('div');

  const backButton = createButton('back', () => {
    window.location.hash = '#/weekly-menu';
  });
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
