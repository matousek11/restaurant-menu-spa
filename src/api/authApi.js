export function getAuthApi(skipDelay = false) {
  const delay = skipDelay ? 0 : 1000;

  return {
    login: (username, password) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'admin' && password === 'admin') {
            resolve({ status: 200, token: 'mock-jwt-token-123' });
          } else {
            reject({ status: 401, message: 'Invalid credentials. Please try admin/admin.' });
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
