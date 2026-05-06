export const AUTH_ROLE_GUEST = 'GUEST';
export const AUTH_ROLE_AUTHENTICATING = 'AUTHENTICATING';
export const AUTH_ROLE_MANAGER = 'MANAGER';
export const AUTH_ROLE_USER = 'USER';

export function createInitialAuthState() {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('authRole');
  return {
    role: (token && role) ? role : AUTH_ROLE_GUEST,
    token: token ?? null,
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

export function loginSuccess(state, token, role, userId) {
  if (state.role !== AUTH_ROLE_AUTHENTICATING) {
    return state;
  }
  localStorage.setItem('authToken', token);
  localStorage.setItem('authRole', role);
  localStorage.setItem('authUserId', userId);
  return {
    ...state,
    role: role,
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
  if (state.role !== AUTH_ROLE_MANAGER && state.role !== AUTH_ROLE_USER) {
    return state;
  }
  localStorage.removeItem('authToken');
  localStorage.removeItem('authRole');
  localStorage.removeItem('authUserId');
  return {
    ...state,
    role: AUTH_ROLE_GUEST,
    token: null,
    error: null
  };
}
