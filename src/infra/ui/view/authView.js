import { AUTH_ROLE_GUEST, AUTH_ROLE_MANAGER, AUTH_ROLE_AUTHENTICATING } from '../../../app/auth/authTransitions.js';
import { ACTION_AUTH_LOGIN } from '../../../app/actions/authLoginAction.js';
import { ACTION_AUTH_LOGOUT } from '../../../app/actions/authLogoutAction.js';

/**
 * Creates the login form DOM structure based on the Auth state.
 * 
 * @param {Function} dispatch - The dispatcher function
 * @param {Object} authState - The current state of the auth entity
 * @returns {HTMLElement} - The login form container element
 */
export function renderLoginForm(dispatch, authState) {
  const container = document.createElement('div');
  container.className = 'auth-login-container';

  // Home button
  const homeBtn = document.createElement('button');
  homeBtn.textContent = '← Home';
  homeBtn.className = 'auth-btn auth-btn-home';
  homeBtn.onclick = () => window.location.hash = '#/';
  container.appendChild(homeBtn);

  const form = document.createElement('form');
  form.className = 'auth-login-form';

  const title = document.createElement('h2');
  title.textContent = 'Login';
  form.appendChild(title);

  const errorDiv = document.createElement('div');
  errorDiv.className = 'auth-error-message';
  errorDiv.style.color = '#e74c3c';
  errorDiv.style.minHeight = '20px';
  if (authState.error) {
    errorDiv.textContent = authState.error;
  }
  form.appendChild(errorDiv);

  const usernameLabel = document.createElement('label');
  usernameLabel.textContent = 'Username: ';
  usernameLabel.className = 'auth-label';
  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.name = 'username';
  usernameInput.id = 'login-username';
  usernameInput.className = 'auth-input';
  usernameInput.placeholder = 'Enter username';
  usernameInput.required = true;
  usernameLabel.appendChild(usernameInput);
  form.appendChild(usernameLabel);

  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password: ';
  passwordLabel.className = 'auth-label';
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.name = 'password';
  passwordInput.id = 'login-password';
  passwordInput.className = 'auth-input';
  passwordInput.placeholder = 'Enter password';
  passwordInput.required = true;
  passwordLabel.appendChild(passwordInput);
  form.appendChild(passwordLabel);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.id = 'login-submit';
  submitButton.className = 'auth-btn auth-btn-submit';
  submitButton.textContent = authState.role === AUTH_ROLE_AUTHENTICATING ? 'Logging in...' : 'Login';
  if (authState.role === AUTH_ROLE_AUTHENTICATING) {
    submitButton.disabled = true;
    usernameInput.disabled = true;
    passwordInput.disabled = true;
  }
  form.appendChild(submitButton);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    dispatch({
      type: ACTION_AUTH_LOGIN,
      payload: { username, password }
    });
  });

  container.appendChild(form);

  return container;
}

/**
 * Iterates through the document and hides/shows parts based on Auth state.
 * 
 * @param {HTMLElement} rootElement - The DOM root to apply changes to
 * @param {Object} authState - Current state of the auth entity
 * @param {Function} dispatch - Dispatcher function (for handling unauthorized access redirects or logout)
 */
export function applyAuthVisibility(rootElement, authState, dispatch) {
  // Elements intended only for MANAGER (e.g. edit buttons)
  const managerElements = rootElement.querySelectorAll('[data-auth="MANAGER"]');
  managerElements.forEach(el => {
    if (authState.role === AUTH_ROLE_MANAGER) {
      el.style.display = '';
    } else {
      el.style.display = 'none';
      // Secure access: unauthenticated users cannot see edit interfaces
    }
  });

  // Handle Logout button visibility and binding
  const logoutButtons = rootElement.querySelectorAll('[data-action="logout"]');
  logoutButtons.forEach(btn => {
    if (authState.role === AUTH_ROLE_MANAGER) {
      btn.style.display = '';
      btn.onclick = (e) => {
         e.preventDefault();
         dispatch({ type: ACTION_AUTH_LOGOUT });
      };
    } else {
      btn.style.display = 'none';
    }
  });

  // Example redirect: If a view requires MANAGER role and user is GUEST
  // Assuming 'data-view-protected' attribute indicates a protected area.
  const isProtectedView = rootElement.getAttribute('data-view-protected') === 'true';
  if (isProtectedView && authState.role !== AUTH_ROLE_MANAGER && authState.role !== AUTH_ROLE_AUTHENTICATING) {
    // We dispatch an action to switch view back to a safe route / login screen.
    dispatch({ type: 'ACTION_NAVIGATE_LOGIN' }); 
  }
}
