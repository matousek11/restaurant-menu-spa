/**
 * MelnykBohdan.test.js
 *
 * Tests for IR03 (Asynchronous operations) and IR06 (Rendering logic).
 * Entity: Auth  |  Author: Bohdan Melnyk
 *
 * Uses the GIVEN-WHEN-THEN pattern with console.assert for all verifications.
 */

import { createStore } from '../../../src/infra/store/createStore.js';
import { createInitialState } from '../../../src/app/state.js';
import * as constants from '../../../src/constants.js';
import { getMockApi } from '../../../src/api/mockApi.js';
import { authLoginAction } from '../../../src/app/actions/authLoginAction.js';
import { authLogoutAction } from '../../../src/app/actions/authLogoutAction.js';
import { setViewAction } from '../../../src/app/actions/setViewAction.js';
import {
  AUTH_ROLE_GUEST,
  AUTH_ROLE_MANAGER,
} from '../../../src/app/auth/authTransitions.js';

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function createTestSetup() {
  const store = createStore(createInitialState());
  const api = getMockApi([], true);
  return { store, api };
}

export async function testAuthLogin() {
  console.log('--- Scenario 1: Login ---');

  const { store, api } = createTestSetup();
  localStorage.removeItem('authToken');
  store.setState((state) => ({
    ...state,
    auth: { role: AUTH_ROLE_GUEST, token: null, error: null },
  }));

  const stateBefore = clone(store.getState());
  console.assert(
    stateBefore.auth.role === AUTH_ROLE_GUEST,
    'GIVEN: auth.role should be GUEST before login'
  );

  await authLoginAction({
    store,
    api,
    payload: { username: 'admin', password: 'admin' },
  });

  const stateAfter = clone(store.getState());
  console.assert(
    stateAfter.auth.role !== AUTH_ROLE_GUEST,
    'THEN: auth.role should no longer be GUEST after successful login'
  );
  console.assert(
    stateAfter.auth.role === AUTH_ROLE_MANAGER,
    'THEN: auth.role should be MANAGER after successful login'
  );
  console.assert(
    stateAfter.auth.token !== null && stateAfter.auth.token !== undefined,
    'THEN: auth.token should exist after successful login'
  );
  console.assert(
    stateAfter.auth.error === null,
    'THEN: auth.error should be null after successful login'
  );

  console.log(' Scenario 1 (Login) passed.');
}

export async function testAuthLogout() {
  console.log('--- Scenario 2: Logout ---');

  const { store, api } = createTestSetup();
  store.setState((state) => ({
    ...state,
    auth: { role: AUTH_ROLE_MANAGER, token: 'mock-jwt-token-123', error: null },
  }));
  localStorage.setItem('authToken', 'mock-jwt-token-123');

  const stateBefore = clone(store.getState());
  console.assert(
    stateBefore.auth.role === AUTH_ROLE_MANAGER,
    'GIVEN: auth.role should be MANAGER before logout'
  );
  console.assert(
    stateBefore.auth.token === 'mock-jwt-token-123',
    'GIVEN: auth.token should be present before logout'
  );

  await authLogoutAction({ store, api });

  const stateAfter = clone(store.getState());
  console.assert(
    stateAfter.auth.role === AUTH_ROLE_GUEST,
    'THEN: auth.role should be GUEST after logout'
  );
  console.assert(
    stateAfter.auth.token === null,
    'THEN: auth.token should be null after logout'
  );
  console.assert(
    stateAfter.auth.error === null,
    'THEN: auth.error should be null after logout'
  );
  console.assert(
    stateAfter.ui.view === constants.ACTION_CURRENT_WEEKLY_MENU,
    'THEN: ui.view should reset to the current weekly menu after logout'
  );

  console.log(' Scenario 2 (Logout) passed.');
}

export async function testSetViewLogin() {
  console.log('--- Scenario 3: Set View to Login ---');

  const { store } = createTestSetup();
  const stateBefore = clone(store.getState());
  console.assert(
    stateBefore.ui.view === constants.ACTION_CURRENT_WEEKLY_MENU,
    'GIVEN: ui.view should be the default view (current weekly menu) initially'
  );

  setViewAction({
    store,
    payload: { view: constants.VIEW_LOGIN },
  });

  const stateAfter = clone(store.getState());
  console.assert(
    stateAfter.ui.view === constants.VIEW_LOGIN,
    'THEN: ui.view should be VIEW_LOGIN after dispatching ACTION_SET_VIEW'
  );

  console.log('Scenario 3 (Set View to Login) passed.');
}

export async function runAll() {
  console.log(' MelnykBohdan – IR03 & IR06 Test Suite  ');

  await testAuthLogin();
  await testAuthLogout();
  await testSetViewLogin();

  console.log('\n All MelnykBohdan tests completed.');
}
