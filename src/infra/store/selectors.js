// src/infra/store/selectors.js
// selectViewState je jediné místo rozhodování o stavu-pohledu aplikace

import { SUBSCRIPTION_ACTIVE, SUBSCRIPTION_PAUSED } from '../../app/subscription/subscriptionTransitions.js';

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
  switch (state.ui.mode) {
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
    default:
      return {
        type: 'ERROR',
        message: `Guest role — neznámý mode: ${state.ui.mode}`,
      };
  }
}

function selectManagerView(state) {
  switch (state.ui.mode) {
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
    case 'LOADING':
      return { type: 'LOADING' };

    case 'ERROR':
      return { type: 'ERROR', message: state.ui.errorMessage };

    case 'READY':
      // druhá osa: role
      switch (state.auth.role) {
        case 'GUEST':
        case 'UNAUTHORIZED':
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
