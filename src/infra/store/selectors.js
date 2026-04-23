// src/infra/store/selectors.js
// selectViewState je jediné místo rozhodování o stavu-pohledu aplikace

import { SUBSCRIPTION_ACTIVE, SUBSCRIPTION_PAUSED } from '../../app/subscription/subscriptionTransitions.js';
import {
  ACTION_CURRENT_WEEKLY_MENU,
  ACTION_WEEKLY_MENU_CREATE,
  ACTION_WEEKLY_MENU_DETAIL,
  ACTION_WEEKLY_MENU_LIST,
  ACTION_WEEKLY_MENU_UPDATE_STATE,
  ERROR,
  LOADED,
  LOADING,
  VIEW_LOGIN,
  WEEKLY_MENU_DRAFT,
  WEEKLY_MENU_PUBLISHED,
} from '../../constants.js';
import {getMondayDateOfCurrentWeek} from '../../app/helpers/dateManipulation.js';
import {canDisplayStateChangeButtons, canUpdateWeeklyMenu} from '../../app/permissions/weeklyMenuPermissions.js';

// ==================
// Základní selektory
// ==================

export function selectSubscriptions(state) {
  return state.subscriptions ?? [];
}

export function selectSubscriptionById(state) {
  const id = state.ui.selectedSubscriptionId;
  if (!id) return null;
  return state.subscriptions.find((s) => s.id === id) ?? null;
}

export function selectActiveSubscription(state) {
  const userId = state.currentUser.userId;
  return (
    state.subscriptions.find(
      (s) =>
        s.userId === userId &&
        (s.status === SUBSCRIPTION_ACTIVE || s.status === SUBSCRIPTION_PAUSED),
    ) ?? null
  );
}

// ==================
// Odvozené hodnoty pro UI
// ==================

export function canCreateSubscription(state) {
  if (state.ui.status !== 'READY') return false;
  return selectActiveSubscription(state) === null;
}

export function canPauseSubscription(state) {
  if (state.ui.status !== 'READY') return false;
  const subscription = selectSubscriptionById(state);
  if (!subscription) return false;
  return subscription.status === SUBSCRIPTION_ACTIVE;
}

export function canResumeSubscription(state) {
  if (state.ui.status !== 'READY') return false;
  const subscription = selectSubscriptionById(state);
  if (!subscription) return false;
  return subscription.status === SUBSCRIPTION_PAUSED;
}

export function canCancelSubscription(state) {
  if (state.ui.status !== 'READY') return false;
  const subscription = selectSubscriptionById(state);
  if (!subscription) return false;
  return (
    subscription.status === SUBSCRIPTION_ACTIVE ||
    subscription.status === SUBSCRIPTION_PAUSED
  );
}

// ==================
// View selection — tři osy rozhodování
// (stejný pattern jako vzorový projekt: status → role → mode)
// ==================

function selectGuestView(state) {
  console.log('[selectGuestView] view ->', state.ui.view);
  switch (state.ui.view) {
    case ACTION_CURRENT_WEEKLY_MENU:
      const currentWeekId = getMondayDateOfCurrentWeek();
      return {
        weeklyMenu: state.weeklyMenus.find(
          menu => menu.weekStartId === currentWeekId && menu.state === WEEKLY_MENU_PUBLISHED
        ),
        canDisplayStateChangeButtons: (_, __) => false,
      }

    case ACTION_WEEKLY_MENU_DETAIL:
      return {
        weeklyMenu: state.weeklyMenus.find(
          menu => menu.weekStartId === state.ui.selectedWeekStartId
        ),
        canDisplayStateChangeButtons: canDisplayStateChangeButtons,
        canUpdateWeeklyMenu: canUpdateWeeklyMenu,
      }

    case ACTION_WEEKLY_MENU_UPDATE_STATE:
      return {
        weeklyMenu: state.weeklyMenus.find(
          menu => menu.weekStartId === state.ui.selectedWeekStartId
        )
      }

    case ACTION_WEEKLY_MENU_LIST:
      return {
        weeklyMenus: state.weeklyMenus,
      }

    case ACTION_WEEKLY_MENU_CREATE:
      return {
        weeklyMenu: {
          weekStartId: getMondayDateOfCurrentWeek(),
          state: WEEKLY_MENU_DRAFT,
          days: Array.from({length: 7}, (_, dayId) => ({
            dayId,
            meals: [],
          })),
        },
        canDisplayStateChangeButtons: (_, __) => false,
        canUpdateWeeklyMenu: () => true,
      }


    case 'SUBSCRIPTION_LIST':
      return {
        type: 'SUBSCRIPTION_LIST',
        subscriptions: selectSubscriptions(state).filter(
          (s) => s.userId === state.currentUser.userId,
        ),
        canCreate: canCreateSubscription(state),
      };
    case 'SUBSCRIPTION_DETAIL':
      return {
        type: 'SUBSCRIPTION_DETAIL',
        subscription: selectSubscriptionById(state),
        canPause: canPauseSubscription(state),
        canResume: canResumeSubscription(state),
        canCancel: canCancelSubscription(state),
      };
    case 'SUBSCRIPTION_CREATE':
      return {
        type: 'SUBSCRIPTION_CREATE',
        canCreate: canCreateSubscription(state),
      };
    case VIEW_LOGIN:
      return { type: VIEW_LOGIN };
    default:
      return {
        type: 'ERROR',
        message: `Guest role — neznámý mode: ${state.ui.mode}`,
      };
  }
}

function selectManagerView(state) {
  console.log('[selectManagerView] view ->', state.ui.view);
  switch (state.ui.view) {
    case ACTION_CURRENT_WEEKLY_MENU:
      const currentWeekId = getMondayDateOfCurrentWeek();
      return {
        weeklyMenu: state.weeklyMenus.find(
          menu => menu.weekStartId === currentWeekId
        ),
        canDisplayStateChangeButtons: canDisplayStateChangeButtons,
        canUpdateWeeklyMenu: canUpdateWeeklyMenu,
      }

    case ACTION_WEEKLY_MENU_DETAIL:
      return {
        weeklyMenu: state.weeklyMenus.find(
          menu => menu.weekStartId === state.ui.selectedWeekStartId
        ),
        canDisplayStateChangeButtons: canDisplayStateChangeButtons,
        canUpdateWeeklyMenu: canUpdateWeeklyMenu,
      }

    case ACTION_WEEKLY_MENU_UPDATE_STATE:
      return {
        weeklyMenu: state.weeklyMenus.find(
          menu => menu.weekStartId === state.ui.selectedWeekStartId
        )
      }

    case ACTION_WEEKLY_MENU_LIST:
      return {
        weeklyMenus: state.weeklyMenus,
      }

    case ACTION_WEEKLY_MENU_CREATE:
      return {
        weeklyMenu: {
          weekStartId: getMondayDateOfCurrentWeek(),
          state: WEEKLY_MENU_DRAFT,
          days: Array.from({length: 7}, (_, dayId) => ({
            dayId,
            meals: [],
          })),
        },
        canDisplayStateChangeButtons: (_, __) => false,
        canUpdateWeeklyMenu: () => true,
      }

    case VIEW_LOGIN:
      return { type: VIEW_LOGIN };

    case 'SUBSCRIPTION_LIST':
      return {
        type: 'SUBSCRIPTION_LIST',
        subscriptions: selectSubscriptions(state),
        canCreate: false,
      };
    case 'SUBSCRIPTION_DETAIL':
      return {
        type: 'SUBSCRIPTION_DETAIL',
        subscription: selectSubscriptionById(state),
        canPause: canPauseSubscription(state),
        canResume: canResumeSubscription(state),
        canCancel: canCancelSubscription(state),
      };
    default:
      return {
        type: 'ERROR',
        message: `Manager role — neznámý mode: ${state.ui.mode}`,
      };
  }
}

export function selectViewState(state) {
  console.log('[selectViewState] state ->', state);

  // první osa: status
  switch (state.ui.status) {
    case LOADING:
      return { type: LOADING };

    case ERROR:
      return { type: ERROR, message: state.ui.errorMessage };

    case LOADED:
      // druhá osa: role
      switch (state.auth.role) {
        case 'GUEST':
        case 'UNAUTHORIZED':
        case 'AUTHENTICATING':
          return selectGuestView(state);

        case 'MANAGER':
          return selectManagerView(state);

        default:
          return {
            type: 'ERROR',
            message: `Neznámá role: ${state.auth.role}`,
          };
      }

    default:
      return {
        type: 'ERROR',
        message: `Neznámý ui.status: ${state.ui.status}`,
      };
  }
}
