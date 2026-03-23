import { loginRequest, loginSuccess, loginFailure } from '../auth/authTransitions.js';

export const ACTION_AUTH_LOGIN = 'ACTION_AUTH_LOGIN';

export async function authLoginAction({ store, api, payload }) {
  // 1. Transition to AUTHENTICATING
  store.setState((state) => ({
    ...state,
    auth: loginRequest(state.auth)
  }));

  try {
    // 2. Perform API request
    const response = await api.auth.login(payload.username, payload.password);
    
    // 3. Handle success (200 OK)
    if (response.status === 200) {
      store.setState((state) => ({
        ...state,
        auth: loginSuccess(state.auth, response.token)
      }));
    } else {
      throw new Error('Unexpected response status');
    }
  } catch (error) {
    // 4. Handle error (e.g., 401 Unauthorized or network error)
    const errorMessage = error.message || 'Network error occurred';
    store.setState((state) => ({
      ...state,
      auth: loginFailure(state.auth, errorMessage)
    }));
  }
}
