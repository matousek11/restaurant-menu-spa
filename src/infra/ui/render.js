import * as constants from '../../constants.js';
import {currentWeeklyMenuView} from './view/currentWeeklyMenuView.js';
import {selectViewState} from '../store/selectors.js';
import {weeklyMenuListView} from './view/weeklyMenuListView.js';
import {weeklyMenuDetailView} from './view/weeklyMenuDetailView.js';
import {weeklyMenuCreateView} from './view/weeklyMenuCreateView.js';

export function render(root, state, dispatch) {
    root.replaceChildren();

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

    let renderedView = null;
    console.log("view", state.ui.view);
    switch (state.ui.view) {
        case constants.ACTION_CURRENT_WEEKLY_MENU:
            renderedView = currentWeeklyMenuView(viewState.weeklyMenu, viewState.canDisplayStateChangeButtons);
            break;
        case constants.ACTION_WEEKLY_MENU_LIST:
            renderedView = weeklyMenuListView(viewState.weeklyMenus, dispatch);
            break;
        case constants.ACTION_WEEKLY_MENU_DETAIL:
            renderedView = weeklyMenuDetailView(viewState.weeklyMenu, viewState.canDisplayStateChangeButtons, viewState.canUpdateWeeklyMenu);
            break;
        case constants.ACTION_WEEKLY_MENU_CREATE:
            renderedView = weeklyMenuCreateView(viewState.weeklyMenu);
            break;
        default:
            break;
    }

    root.appendChild(renderedView);
}