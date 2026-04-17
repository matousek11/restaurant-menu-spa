import { describe, it, expect } from 'vitest';
import {
  createSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  expireSubscription,
  decrementRemainingDays,
  SUBSCRIPTION_ACTIVE,
  SUBSCRIPTION_PAUSED,
  SUBSCRIPTION_CANCELLED,
  SUBSCRIPTION_EXPIRED,
} from '../../../../src/app/subscription/subscriptionTransitions.js';

describe('createSubscription', () => {
  it('vytvoří předplatné ve stavu ACTIVE', () => {
    const subscription = createSubscription('user-1', '2026-04-06', 30);

    expect(subscription.status).toBe(SUBSCRIPTION_ACTIVE);
    expect(subscription.userId).toBe('user-1');
    expect(subscription.weekStartId).toBe('2026-04-06');
    expect(subscription.totalDays).toBe(30);
    expect(subscription.remainingDays).toBe(30);
    expect(subscription.pausedAt).toBeNull();
    expect(subscription.cancelledAt).toBeNull();
  });
});

describe('pauseSubscription', () => {
  it('přechod ACTIVE → PAUSED', () => {
    const subscription = createSubscription('user-1', '2026-04-06', 30);

    const paused = pauseSubscription(subscription);

    expect(paused.status).toBe(SUBSCRIPTION_PAUSED);
    expect(paused.pausedAt).not.toBeNull();
    expect(paused.remainingDays).toBe(30);
  });

  it('ignoruje přechod pokud předplatné není ACTIVE', () => {
    const subscription = createSubscription('user-1', '2026-04-06', 30);
    const paused = pauseSubscription(subscription);

    const result = pauseSubscription(paused);

    expect(result.status).toBe(SUBSCRIPTION_PAUSED);
    expect(result).toBe(paused);
  });
});

describe('resumeSubscription', () => {
  it('přechod PAUSED → ACTIVE, zbývající dny zachovány', () => {
    const subscription = createSubscription('user-1', '2026-04-06', 30);
    const paused = pauseSubscription(subscription);

    const resumed = resumeSubscription(paused);

    expect(resumed.status).toBe(SUBSCRIPTION_ACTIVE);
    expect(resumed.pausedAt).toBeNull();
    expect(resumed.remainingDays).toBe(30);
  });

  it('ignoruje přechod pokud předplatné není PAUSED', () => {
    const subscription = createSubscription('user-1', '2026-04-06', 30);

    const result = resumeSubscription(subscription);

    expect(result.status).toBe(SUBSCRIPTION_ACTIVE);
    expect(result).toBe(subscription);
  });
});

describe('cancelSubscription', () => {
  it('přechod ACTIVE → CANCELLED', () => {
    const subscription = createSubscription('user-1', '2026-04-06', 30);

    const cancelled = cancelSubscription(subscription);

    expect(cancelled.status).toBe(SUBSCRIPTION_CANCELLED);
    expect(cancelled.cancelledAt).not.toBeNull();
  });

  it('přechod PAUSED → CANCELLED', () => {
    const subscription = createSubscription('user-1', '2026-04-06', 30);
    const paused = pauseSubscription(subscription);

    const cancelled = cancelSubscription(paused);

    expect(cancelled.status).toBe(SUBSCRIPTION_CANCELLED);
  });

  it('ignoruje přechod pokud předplatné je již CANCELLED', () => {
    const subscription = createSubscription('user-1', '2026-04-06', 30);
    const cancelled = cancelSubscription(subscription);

    const result = cancelSubscription(cancelled);

    expect(result).toBe(cancelled);
  });
});

describe('expireSubscription', () => {
  it('přechod ACTIVE → EXPIRED pokud remainingDays === 0', () => {
    const subscription = { ...createSubscription('user-1', '2026-04-06', 30), remainingDays: 0 };

    const expired = expireSubscription(subscription);

    expect(expired.status).toBe(SUBSCRIPTION_EXPIRED);
  });

  it('ignoruje přechod pokud remainingDays > 0', () => {
    const subscription = createSubscription('user-1', '2026-04-06', 30);

    const result = expireSubscription(subscription);

    expect(result.status).toBe(SUBSCRIPTION_ACTIVE);
    expect(result).toBe(subscription);
  });

  it('ignoruje přechod pokud předplatné není ACTIVE', () => {
    const subscription = createSubscription('user-1', '2026-04-06', 30);
    const paused = pauseSubscription({ ...subscription, remainingDays: 0 });

    const result = expireSubscription(paused);

    expect(result.status).toBe(SUBSCRIPTION_PAUSED);
  });
});

describe('decrementRemainingDays', () => {
  it('odečte jeden den z ACTIVE předplatného', () => {
    const subscription = createSubscription('user-1', '2026-04-06', 30);

    const updated = decrementRemainingDays(subscription);

    expect(updated.remainingDays).toBe(29);
    expect(updated.status).toBe(SUBSCRIPTION_ACTIVE);
  });

  it('přejde do EXPIRED pokud remainingDays dosáhne 0', () => {
    const subscription = { ...createSubscription('user-1', '2026-04-06', 1), remainingDays: 1 };

    const updated = decrementRemainingDays(subscription);

    expect(updated.remainingDays).toBe(0);
    expect(updated.status).toBe(SUBSCRIPTION_EXPIRED);
  });

  it('ignoruje odečítání pokud předplatné není ACTIVE', () => {
    const subscription = createSubscription('user-1', '2026-04-06', 30);
    const paused = pauseSubscription(subscription);

    const result = decrementRemainingDays(paused);

    expect(result).toBe(paused);
    expect(result.remainingDays).toBe(30);
  });
});
