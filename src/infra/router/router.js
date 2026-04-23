// src/infra/router/router.js

import {
  ACTION_CURRENT_WEEKLY_MENU,
  ACTION_MAKE_WEEKLY_MENU_CREATE,
  ACTION_MAKE_WEEKLY_MENU_DELETE,
  ACTION_SET_VIEW,
  ACTION_WEEKLY_MENU_CREATE,
  ACTION_WEEKLY_MENU_DETAIL,
  ACTION_WEEKLY_MENU_LIST,
  ACTION_WEEKLY_MENU_UPDATE_DATE,
  ACTION_WEEKLY_MENU_UPDATE_STATE,
  WEEKLY_MENU_DRAFT,
  VIEW_CURRENT_WEEKLY_MENU,
  VIEW_DELETE_WEEKLY_MENU,
  VIEW_DETAIL_WEEKLY_MENU,
  VIEW_LOGIN,
  VIEW_WEEKLY_MENU_CHANGE_STATE,
  VIEW_WEEKLY_MENU_CREATE,
  VIEW_WEEKLY_MENU_CREATE_SAVE,
  VIEW_WEEKLY_MENU_UPDATE_DATE,
  VIEW_WEEKLY_MENU_LIST,
} from '../../constants.js';

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

  // / (empty path when the application is loaded)
  if (parts.length === 0) {
    return { route: VIEW_CURRENT_WEEKLY_MENU };
  }

  if (parts.length === 2 && parts[0] === 'weekly-menu' && parts[1] !== undefined) {
    return { route: VIEW_DETAIL_WEEKLY_MENU, weeklyMenuId: parts[1] };
  }

  if (parts.length === 3 && parts[0] === 'weekly-menu-state' && parts[1] !== undefined && parts[2] !== undefined) {
    return { route: VIEW_WEEKLY_MENU_CHANGE_STATE, weeklyMenuId: parts[1], newState: parts[2] };
  }

  if (parts.length === 3 && parts[0] === 'weekly-menu-date' && parts[1] !== undefined && parts[2] !== undefined) {
    return {route: VIEW_WEEKLY_MENU_UPDATE_DATE, weeklyMenuId: parts[1], newDate: parts[2]};
  }

  if (parts.length === 1 && parts[0] === 'create-weekly-menu') {
    return {route: VIEW_WEEKLY_MENU_CREATE};
  }

  if (parts.length === 2 && parts[0] === 'create-weekly-menu' && parts[1] !== undefined) {
    return {route: VIEW_WEEKLY_MENU_CREATE_SAVE, weekStartId: parts[1]};
  }

  if (parts.length === 1 && parts[0] === 'weekly-menu') {
    return { route: VIEW_WEEKLY_MENU_LIST };
  }

  if (parts.length === 2 && parts[0] === 'delete-weekly-menu' && parts[1] !== undefined) {
    return {
      route: VIEW_DELETE_WEEKLY_MENU,
      weeklyMenuId: parts[1],
    };
  }

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

  // /login
  if (parts.length === 1 && parts[0] === 'login') {
    return { route: VIEW_LOGIN };
  }

  return { route: 'UNKNOWN' };
}

/**
 * Převádí rozpoznanou trasu na aplikační akci.
 */
export function routeToAction(parsed) {
  console.log('[router] routeToAction ->', parsed.route);
  switch (parsed.route) {
    case VIEW_CURRENT_WEEKLY_MENU:
      return {type: ACTION_CURRENT_WEEKLY_MENU};

    case VIEW_DETAIL_WEEKLY_MENU:
      return {type: ACTION_WEEKLY_MENU_DETAIL, payload: {weekStartId: parsed.weeklyMenuId}};

    case VIEW_WEEKLY_MENU_CHANGE_STATE:
      return {type: ACTION_WEEKLY_MENU_UPDATE_STATE, payload: {weekStartId: parsed.weeklyMenuId, newState: parsed.newState}};

    case VIEW_WEEKLY_MENU_UPDATE_DATE:
      return {
        type: ACTION_WEEKLY_MENU_UPDATE_DATE,
        payload: {weekStartId: parsed.weeklyMenuId, newWeekStartId: parsed.newDate},
      };

    case VIEW_WEEKLY_MENU_CREATE:
      return {type: ACTION_WEEKLY_MENU_CREATE};

    case VIEW_WEEKLY_MENU_CREATE_SAVE:
      return {
        type: ACTION_MAKE_WEEKLY_MENU_CREATE,
        payload: {
          weeklyMenu: {
            weekStartId: parsed.weekStartId,
            state: WEEKLY_MENU_DRAFT,
            days: Array.from({length: 7}, (_, dayId) => ({
              dayId,
              meals: [],
            })),
          }
        },
      };

    case VIEW_WEEKLY_MENU_LIST:
      return {type: ACTION_WEEKLY_MENU_LIST};

    case VIEW_DELETE_WEEKLY_MENU:
      return {type: ACTION_MAKE_WEEKLY_MENU_DELETE, payload: {weekStartId: parsed.weeklyMenuId}};

    case 'SUBSCRIPTIONS':
      return { type: 'ACTION_ENTER_SUBSCRIPTIONS' };

    case 'SUBSCRIPTION_CREATE':
      return { type: 'ACTION_ENTER_SUBSCRIPTION_CREATE' };

    case 'SUBSCRIPTION_DETAIL':
      return {
        type: 'ACTION_ENTER_SUBSCRIPTION_DETAIL',
        payload: { subscriptionId: parsed.subscriptionId },
      };

    case VIEW_LOGIN:
      return { type: ACTION_SET_VIEW, payload: { view: VIEW_LOGIN } };

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
