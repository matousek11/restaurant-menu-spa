export const SUBSCRIPTION_ACTIVE = 'ACTIVE';
export const SUBSCRIPTION_PAUSED = 'PAUSED';
export const SUBSCRIPTION_CANCELLED = 'CANCELLED';
export const SUBSCRIPTION_EXPIRED = 'EXPIRED';

export function createSubscription(userId, weekStartId, totalDays) {
  return {
    id: crypto.randomUUID(),
    userId,
    weekStartId,
    totalDays,
    remainingDays: totalDays,
    status: SUBSCRIPTION_ACTIVE,
    createdAt: new Date().toISOString(),
    pausedAt: null,
    cancelledAt: null,
  };
}

export function pauseSubscription(subscription) {
  if (subscription.status !== SUBSCRIPTION_ACTIVE) {
    return subscription;
  }
  return {
    ...subscription,
    status: SUBSCRIPTION_PAUSED,
    pausedAt: new Date().toISOString(),
  };
}

export function resumeSubscription(subscription) {
  if (subscription.status !== SUBSCRIPTION_PAUSED) {
    return subscription;
  }
  return {
    ...subscription,
    status: SUBSCRIPTION_ACTIVE,
    pausedAt: null,
  };
}

export function cancelSubscription(subscription) {
  if (
    subscription.status !== SUBSCRIPTION_ACTIVE &&
    subscription.status !== SUBSCRIPTION_PAUSED
  ) {
    return subscription;
  }
  return {
    ...subscription,
    status: SUBSCRIPTION_CANCELLED,
    cancelledAt: new Date().toISOString(),
  };
}

export function expireSubscription(subscription) {
  if (subscription.status !== SUBSCRIPTION_ACTIVE) {
    return subscription;
  }
  if (subscription.remainingDays !== 0) {
    return subscription;
  }
  return {
    ...subscription,
    status: SUBSCRIPTION_EXPIRED,
  };
}

export function decrementRemainingDays(subscription) {
  if (subscription.status !== SUBSCRIPTION_ACTIVE) {
    return subscription;
  }
  const remainingDays = subscription.remainingDays - 1;
  if (remainingDays <= 0) {
    return { ...subscription, remainingDays: 0, status: SUBSCRIPTION_EXPIRED };
  }
  return { ...subscription, remainingDays };
}
