import {createInitialState} from './state.js';
import {createStore} from '../infra/store/createStore.js';
import {createDispatcher} from './dispatch.js';
import {appInit} from './appInit.js';
import {getWeeklyMenus} from '../database/weeklyMenuData.js';
import {getMockApi} from '../api/mockApi.js';
import {urlToAction} from '../infra/router/router.js';
import {render} from '../infra/ui/render.js';

const store = createStore(createInitialState());
let mockApi = getMockApi(getWeeklyMenus());

const dispatch = createDispatcher(store, mockApi);

const root = document.getElementById('app');
store.subscribe((state) => render(root, state, dispatch));

appInit(store, mockApi);

// IR04 — Router: reacts on changes in the browser history
window.addEventListener('popstate', () => dispatch(urlToAction()));

// IR04 — Router: initial route when the application is loaded
dispatch(urlToAction());
