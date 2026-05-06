import { logout } from '../auth/authTransitions.js';
import * as constants from '../../constants.js';

export const ACTION_AUTH_LOGOUT = 'ACTION_AUTH_LOGOUT';

export async function authLogoutAction({ store, api }) {
  const doLogout = (state) => ({
    ...state,
    auth: logout(state.auth),
    currentUser: { userId: null },
    ui: {
      ...state.ui,
      view: constants.ACTION_CURRENT_WEEKLY_MENU,
    }
  });

  try {
    const response = await api.auth.logout();
    if (response.status === 200) {
      store.setState(doLogout);
    }
  } catch (error) {
    // Force logout on error
    store.setState(doLogout);
  }
}
