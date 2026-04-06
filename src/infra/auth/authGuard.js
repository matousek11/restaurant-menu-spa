import {AUTH_ROLE_MANAGER} from '../../app/auth/authTransitions.js';

/**
 * Returns true when the current user is authenticated (MANAGER role).
 *
 * @param {{ role: string, token: string | null }} authState
 * @returns {boolean}
 */
export function isAuthenticated(authState) {
  return authState.role === AUTH_ROLE_MANAGER && authState.token !== null;
}

/**
 * Guards access to protected views.
 * If the user is not authenticated, dispatches ACTION_NAVIGATE_LOGIN to redirect
 * to the login screen.
 *
 * @param {{ role: string, token: string | null }} authState
 * @param {Function} dispatch
 * @returns {boolean} true when access is allowed, false when redirected
 */
export function requireAuth(authState, dispatch) {
  if (isAuthenticated(authState)) {
    return true;
  }
  dispatch({type: 'ACTION_NAVIGATE_LOGIN'});
  return false;
}

/**
 * Checks whether a stored token exists in localStorage and is still present.
 * Call this on app init to decide whether to restore a session.
 *
 * @returns {string | null} the stored token, or null if absent
 */
export function getStoredToken() {
  return localStorage.getItem('authToken');
}
