import {createInitialState} from './state.js';
import {createStore} from '../infra/store/createStore.js';
import {createDispatcher} from './dispatch';
import {appInit} from './appInit';
import {getWeeklyMenus} from '../database/weeklyMenuData';
import {getMockApi} from '../api/mockApi';
import {urlToAction} from '../infra/router/router.js';

const store = createStore(createInitialState);
let mockApi = getMockApi(getWeeklyMenus());

const dispatch = createDispatcher(store, mockApi);

appInit(store, mockApi);

// IR04 — Router: reaguje na změny URL v historii prohlížeče
window.addEventListener('popstate', () => dispatch(urlToAction()));

// IR04 — Router: počáteční route při načtení aplikace
dispatch(urlToAction());
