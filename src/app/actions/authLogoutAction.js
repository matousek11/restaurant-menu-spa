import { logout } from '../auth/authTransitions.js';

export const ACTION_AUTH_LOGOUT = 'ACTION_AUTH_LOGOUT';

export async function authLogoutAction({ store, api }) {
  try {
    const response = await api.auth.logout();
    if (response.status === 200) {
      store.setState((state) => ({
        ...state,
        auth: logout(state.auth)
      }));
    }
  } catch (error) {
    // Force logout on error
    store.setState((state) => ({
      ...state,
      auth: logout(state.auth)
    }));
  }
}
