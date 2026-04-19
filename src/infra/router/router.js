// src/infra/router/router.js

// --------------------------------------------------
// Router pracuje s LOGICKOU CESTOU aplikace,
// nikoli s celou URL (protokol, host, port ho nezajímají).
//
// Podporované cesty:
//
//   #/subscriptions
//   #/subscriptions/create
//   #/subscriptions/:id
// --------------------------------------------------

/**
 * Rozebere logickou cestu aplikace na významovou strukturu.
 * @param {string} path – např. "subscriptions/sub-1"
 */
export function parsePath(path) {
  const parts = path.split('/').filter(Boolean);

  // /subscriptions
  if (parts.length === 1 && parts[0] === 'subscriptions') {
    return { route: 'SUBSCRIPTIONS' };
  }

  // /subscriptions/create
  if (parts.length === 2 && parts[0] === 'subscriptions' && parts[1] === 'create') {
    return { route: 'SUBSCRIPTION_CREATE' };
  }

  // /subscriptions/:id
  if (parts.length === 2 && parts[0] === 'subscriptions') {
    return { route: 'SUBSCRIPTION_DETAIL', subscriptionId: parts[1] };
  }

  return { route: 'UNKNOWN' };
}

/**
 * Převádí rozpoznanou trasu na aplikační akci.
 */
export function routeToAction(parsed) {
  switch (parsed.route) {
    case 'SUBSCRIPTIONS':
      return { type: 'ACTION_ENTER_SUBSCRIPTIONS' };

    case 'SUBSCRIPTION_CREATE':
      return { type: 'ACTION_ENTER_SUBSCRIPTION_CREATE' };

    case 'SUBSCRIPTION_DETAIL':
      return {
        type: 'ACTION_ENTER_SUBSCRIPTION_DETAIL',
        payload: { subscriptionId: parsed.subscriptionId },
      };

    default:
      return { type: 'ROUTE_NOT_FOUND' };
  }
}

/**
 * Adaptér mezi prohlížečem a routerem.
 * Jediné místo, kde saháme na window.location.
 */
export function urlToAction() {
  const hash = window.location.hash; // např. "#/subscriptions/sub-1"
  const path = hash.startsWith('#/') ? hash.slice(2) : '';

  console.log('[router] path:', path);

  return routeToAction(parsePath(path));
}
