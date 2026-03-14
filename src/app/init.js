import { createInitialState } from './state.js';
import { createStore } from '../infra/store/createStore.js';
import {createDispatcher} from './dispatch';
import {appInit} from './appInit';
import {getWeeklyMenus} from '../database/weeklyMenuData';
import {getMockApi} from '../api/mockApi';

const store = createStore(createInitialState);
let mockApi = getMockApi(getWeeklyMenus());

const dispatch = createDispatcher(store, mockApi);

appInit(store, mockApi);