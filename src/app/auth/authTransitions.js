export const AUTH_ROLE_GUEST = 'GUEST';
export const AUTH_ROLE_AUTHENTICATING = 'AUTHENTICATING';
export const AUTH_ROLE_MANAGER = 'MANAGER';

export function createInitialAuthState() {
  const token = localStorage.getItem('authToken');
  return {
    role: token ? AUTH_ROLE_MANAGER : AUTH_ROLE_GUEST,
    token: token,
    error: null
  };
}

export function loginRequest(state) {
  if (state.role !== AUTH_ROLE_GUEST && state.role !== AUTH_ROLE_AUTHENTICATING) {
    return state;
  }
  return {
    ...state,
    role: AUTH_ROLE_AUTHENTICATING,
    error: null
  };
}

export function loginSuccess(state, token) {
  if (state.role !== AUTH_ROLE_AUTHENTICATING) {
    return state;
  }
  localStorage.setItem('authToken', token);
  return {
    ...state,
    role: AUTH_ROLE_MANAGER,
    token: token,
    error: null
  };
}

export function loginFailure(state, error) {
  if (state.role !== AUTH_ROLE_AUTHENTICATING) {
    return state;
  }
  return {
    ...state,
    role: AUTH_ROLE_GUEST,
    error: error
  };
}

export function logout(state) {
  if (state.role !== AUTH_ROLE_MANAGER) {
    return state;
  }
  localStorage.removeItem('authToken');
  return {
    ...state,
    role: AUTH_ROLE_GUEST,
    token: null,
    error: null
  };
}
