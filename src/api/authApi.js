export function getAuthApi(skipDelay = false) {
  const delay = skipDelay ? 0 : 1000;

  return {
    login: (username, password) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'admin' && password === 'admin') {
            resolve({ status: 200, token: 'mock-jwt-token-admin', role: 'MANAGER', userId: 'admin-1' });
          } else if (username === 'user' && password === 'user') {
            resolve({ status: 200, token: 'mock-jwt-token-user', role: 'USER', userId: 'user-1' });
          } else {
            reject({ status: 401, message: 'Invalid credentials. Please try admin/admin or user/user.' });
          }
        }, delay);
      });
    },
    logout: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: 200 });
        }, delay);
      });
    }
  };
}
