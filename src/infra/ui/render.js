import * as constants from '../../constants.js';
import {currentWeeklyMenuView} from './view/currentWeeklyMenuView.js';
import {selectViewState} from '../store/selectors.js';
import {weeklyMenuListView} from './view/weeklyMenuListView.js';
import {weeklyMenuDetailView} from './view/weeklyMenuDetailView.js';
import {weeklyMenuCreateView} from './view/weeklyMenuCreateView.js';
import {renderLoginForm} from './view/authView.js';
import {mealListView} from './view/mealListView.js';
import {mealCreateView} from './view/mealCreateView.js';
import {mealDetailView} from './view/mealDetailView.js';
import {AUTH_ROLE_MANAGER} from '../../app/auth/authTransitions.js';
import {ACTION_AUTH_LOGOUT} from '../../app/actions/authLogoutAction.js';

/**
 * Creates the persistent user-status header bar.
 *
 * @param {Object} authState - The current auth state
 * @param {Function} dispatch - The dispatcher function
 * @returns {HTMLElement}
 */
function createUserStatusHeader(authState, dispatch) {
    const header = document.createElement('div');
    header.className = 'user-status-header';
    header.id = 'user-status-header';

    const statusText = document.createElement('span');
    statusText.className = 'user-status-text';
    statusText.id = 'user-status-text';

    if (authState.role === AUTH_ROLE_MANAGER) {
        statusText.textContent = `Manager: ${authState.token ? authState.token.replace('mock-jwt-token-', '') : 'admin'}`;

        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.className = 'user-status-btn';
        logoutBtn.id = 'header-logout-btn';
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            dispatch({ type: ACTION_AUTH_LOGOUT });
        };

        header.appendChild(statusText);
        header.appendChild(logoutBtn);
    } else {
        statusText.textContent = 'Guest';
        header.appendChild(statusText);
    }

    return header;
}

export function render(root, state, dispatch) {
    root.replaceChildren();

    // Always render the user-status header
    const userHeader = createUserStatusHeader(state.auth, dispatch);
    root.appendChild(userHeader);

    const viewState = selectViewState(state);
    console.log("curr", state, viewState);

    // Global UI
    if (viewState.type === constants.LOADING) {
        const loadingView = document.createElement('div');
        loadingView.textContent = 'loading...'
        root.appendChild(loadingView);
        return;
    }

    if (viewState.type === constants.ERROR) {
        const err = document.createElement('div');
        err.className = 'error-view';
        err.textContent = viewState.message ?? 'Došlo k chybě.';
        root.appendChild(err);
        return;
    }

    // Auth views — handled before the main view switch
    if (viewState.type === constants.VIEW_LOGIN) {
        const loginView = renderLoginForm(dispatch, state.auth);
        root.appendChild(loginView);
        return;
    }

    let renderedView = null;
    console.log("view", state.ui.view);
    switch (state.ui.view) {
        case constants.ACTION_CURRENT_WEEKLY_MENU:
            renderedView = currentWeeklyMenuView(viewState.weeklyMenu, viewState.canDisplayStateChangeButtons, state.auth, dispatch);
            break;
        case constants.ACTION_WEEKLY_MENU_LIST:
            renderedView = weeklyMenuListView(viewState.weeklyMenus, dispatch);
            break;
        case constants.ACTION_WEEKLY_MENU_DETAIL:
            renderedView = weeklyMenuDetailView(viewState.weeklyMenu, viewState.canDisplayStateChangeButtons, viewState.canUpdateWeeklyMenu, dispatch);
            break;
        case constants.ACTION_WEEKLY_MENU_CREATE:
            renderedView = weeklyMenuCreateView(viewState.weeklyMenu);
            break;
        case constants.ACTION_MEAL_LIST:
            renderedView = mealListView(viewState.meals, dispatch);
            break;
        case constants.ACTION_MEAL_CREATE:
            renderedView = mealCreateView(viewState.meal, dispatch);
            break;
        case constants.ACTION_MEAL_DETAIL:
            renderedView = mealDetailView(viewState.meal, dispatch);
            break;
        default:
            break;
    }

    root.appendChild(renderedView);
}