import {createButton} from '../ui-components/button.js';
import {createWeek} from '../ui-components/week.js';

export function weeklyMenuDetailView(weeklyMenu, canDisplayStateChangeButtons, canUpdateWeeklyMenu) {
  const root = document.createElement("div");

  const backButton = createButton(
    'back', () => window.location.hash = '#/weekly-menu'
  );
  root.appendChild(backButton);

  const weeklyMenuRender = createWeek(
    weeklyMenu,
    canDisplayStateChangeButtons,
    canUpdateWeeklyMenu,
    true,
    null,
    (originalWeekStartId, updatedWeekStartId) =>
      `#/weekly-menu-date/${encodeURIComponent(originalWeekStartId)}/${encodeURIComponent(updatedWeekStartId)}`,
  );
  root.appendChild(weeklyMenuRender);

  return root;
}