import {createButton} from '../ui-components/button.js';
import {createWeek} from '../ui-components/week.js';
import {AUTH_ROLE_MANAGER, AUTH_ROLE_USER} from '../../../app/auth/authTransitions.js';
import {ACTION_AUTH_LOGOUT} from '../../../app/actions/authLogoutAction.js';
import {goToWeeklyMenuListHandler} from '../../handlers/weeklyMenuHandlers.js';

/**
 * Renders the current weekly menu view.
 * GUEST sees: Login button + published menu (no management tools).
 * MANAGER sees: Logout button + Admin button + menu with management tools.
 *
 * @param {Object} currentWeeklyMenu - the weekly menu data
 * @param {Function} canDisplayStateChangeButtons - permission check
 * @param {Object} authState - current auth state
 * @param {Function} dispatch - the dispatcher function
 * @returns {HTMLElement}
 */
export function currentWeeklyMenuView(currentWeeklyMenu, canDisplayStateChangeButtons, authState, dispatch) {
    const root = document.createElement("div");

    const navBar = document.createElement('div');
    navBar.className = 'nav-bar';

    if (authState.role === AUTH_ROLE_MANAGER) {
        // MANAGER: show Logout + Admin panel link
        const logoutButton = createButton(
          'Logout', () => dispatch({ type: ACTION_AUTH_LOGOUT })
        );
        logoutButton.id = 'nav-logout-btn';
        logoutButton.className = 'auth-btn auth-btn-logout';
        navBar.appendChild(logoutButton);

        const adminButton = createButton(
          'Admin Panel', goToWeeklyMenuListHandler(),
        );
        adminButton.id = 'nav-admin-btn';
        navBar.appendChild(adminButton);

        const mealsButton = createButton(
          'Správa jídel', () => window.location.hash = '#/meals'
        );
        mealsButton.id = 'nav-meals-btn';
        navBar.appendChild(mealsButton);
    } else if (authState.role === AUTH_ROLE_USER) {
        // USER: show Logout + link to subscriptions
        const logoutButton = createButton(
          'Logout', () => dispatch({ type: ACTION_AUTH_LOGOUT })
        );
        logoutButton.id = 'nav-logout-btn';
        logoutButton.className = 'auth-btn auth-btn-logout';
        navBar.appendChild(logoutButton);

        const subscriptionsButton = createButton(
          'Moje předplatná', () => window.location.hash = '#/subscriptions'
        );
        subscriptionsButton.id = 'nav-subscriptions-btn';
        navBar.appendChild(subscriptionsButton);
    } else {
        // GUEST: show only Login button
        const loginButton = createButton(
          'Login', () => window.location.hash = '#/login'
        );
        loginButton.id = 'nav-login-btn';
        navBar.appendChild(loginButton);
    }

    root.appendChild(navBar);

    const weeklyMenu = createWeek(currentWeeklyMenu ?? undefined, canDisplayStateChangeButtons);
    root.appendChild(weeklyMenu);

    return root;
  }