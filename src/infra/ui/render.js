import * as constants from '../../constants.js';
import {currentWeeklyMenuView} from './view/currentWeeklyMenuView.js';
import {selectViewState} from '../store/selectors.js';
import {weeklyMenuListView} from './view/weeklyMenuListView.js';
import {weeklyMenuDetailView} from './view/weeklyMenuDetailView.js';
import {weeklyMenuCreateView} from './view/weeklyMenuCreateView.js';
import {subscriptionListView} from './view/subscriptionListView.js';
import {subscriptionDetailView} from './view/subscriptionDetailView.js';
import {subscriptionCreateView} from './view/subscriptionCreateView.js';
import {renderLoginForm} from './view/authView.js';
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

    const subscriptionsBtn = document.createElement('button');
    subscriptionsBtn.textContent = 'Moje předplatná';
    subscriptionsBtn.className = 'user-status-btn';
    subscriptionsBtn.id = 'header-subscriptions-btn';
    subscriptionsBtn.onclick = (e) => {
        e.preventDefault();
        window.location.hash = '#/subscriptions';
    };

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
        header.appendChild(subscriptionsBtn);
        header.appendChild(logoutBtn);
    } else {
        statusText.textContent = 'Guest';
        header.appendChild(statusText);
        header.appendChild(subscriptionsBtn);
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

    // Subscription views — dispatched by viewState.type (set by selectors)
    if (viewState.type === constants.ACTION_ENTER_SUBSCRIPTIONS) {
        root.appendChild(subscriptionListView(viewState));
        return;
    }
    if (viewState.type === constants.ACTION_ENTER_SUBSCRIPTION_DETAIL) {
        root.appendChild(subscriptionDetailView(viewState, dispatch));
        return;
    }
    if (viewState.type === constants.ACTION_ENTER_SUBSCRIPTION_CREATE) {
        root.appendChild(subscriptionCreateView(viewState, dispatch));
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
        default:
            break;
    }

    root.appendChild(renderedView);
}