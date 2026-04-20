import {createButton} from '../ui-components/button.js';
import {createWeek} from '../ui-components/week.js';

export function currentWeeklyMenuView(currentWeeklyMenu, canDisplayStateChangeButtons) {
    const root = document.createElement("div");

    const loginButton = createButton(
      'Login', () => console.log('Login')
    );
    root.appendChild(loginButton);

    const adminButton = createButton(
      'Admin', () => window.location.hash = '#/weekly-menu'
    );
    root.appendChild(adminButton);

    const weeklyMenu = createWeek(currentWeeklyMenu, canDisplayStateChangeButtons);
    root.appendChild(weeklyMenu);

    return root;
  }