import { describe, it, expect } from 'vitest';
import { getSubscriptionApi } from '../../../src/api/subscriptionApi.js';
import { SUBSCRIPTION_ACTIVE, SUBSCRIPTION_PAUSED, SUBSCRIPTION_CANCELLED, SUBSCRIPTION_EXPIRED } from '../../../src/app/subscription/subscriptionTransitions.js';

const seedSubscription = {
  id: 'sub-1',
  userId: 'user-1',
  weekStartId: '2026-04-06',
  totalDays: 30,
  remainingDays: 20,
  status: SUBSCRIPTION_ACTIVE,
  createdAt: '2026-04-06T08:00:00.000Z',
  pausedAt: null,
  cancelledAt: null,
};

function getTestApi(seed = [seedSubscription]) {
  return getSubscriptionApi(seed, true);
}

describe('subscriptionApi — getSubscriptions', () => {
  it('vrátí všechna předplatná', async () => {
    const api = getTestApi();

    const result = await api.getSubscriptions();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('sub-1');
  });
});

describe('subscriptionApi — addSubscription', () => {
  it('vytvoří nové předplatné ve stavu ACTIVE', async () => {
    const api = getTestApi([]);

    const subscription = await api.addSubscription('user-1', '2026-04-06', 30);

    expect(subscription.status).toBe(SUBSCRIPTION_ACTIVE);
    expect(subscription.userId).toBe('user-1');
    expect(subscription.remainingDays).toBe(30);
  });

  it('vyhodí chybu pokud zákazník již má aktivní předplatné', async () => {
    const api = getTestApi();

    await expect(api.addSubscription('user-1', '2026-04-13', 30)).rejects.toThrow();
  });
});

describe('subscriptionApi — pauseSubscriptionById', () => {
  it('pozastaví aktivní předplatné', async () => {
    const api = getTestApi();

    const result = await api.pauseSubscriptionById('sub-1');

    expect(result.status).toBe(SUBSCRIPTION_PAUSED);
    expect(result.pausedAt).not.toBeNull();
  });

  it('vyhodí chybu pokud předplatné neexistuje', async () => {
    const api = getTestApi();

    await expect(api.pauseSubscriptionById('neexistuje')).rejects.toThrow();
  });

  it('vyhodí chybu pokud předplatné není ACTIVE', async () => {
    const pausedSeed = { ...seedSubscription, status: SUBSCRIPTION_PAUSED };
    const api = getTestApi([pausedSeed]);

    await expect(api.pauseSubscriptionById('sub-1')).rejects.toThrow();
  });
});

describe('subscriptionApi — resumeSubscriptionById', () => {
  it('obnoví pozastavené předplatné', async () => {
    const pausedSeed = { ...seedSubscription, status: SUBSCRIPTION_PAUSED, pausedAt: new Date().toISOString() };
    const api = getTestApi([pausedSeed]);

    const result = await api.resumeSubscriptionById('sub-1');

    expect(result.status).toBe(SUBSCRIPTION_ACTIVE);
    expect(result.pausedAt).toBeNull();
  });

  it('vyhodí chybu pokud předplatné není PAUSED', async () => {
    const api = getTestApi();

    await expect(api.resumeSubscriptionById('sub-1')).rejects.toThrow();
  });
});

describe('subscriptionApi — cancelSubscriptionById', () => {
  it('zruší aktivní předplatné', async () => {
    const api = getTestApi();

    const result = await api.cancelSubscriptionById('sub-1');

    expect(result.status).toBe(SUBSCRIPTION_CANCELLED);
    expect(result.cancelledAt).not.toBeNull();
  });

  it('zruší pozastavené předplatné', async () => {
    const pausedSeed = { ...seedSubscription, status: SUBSCRIPTION_PAUSED };
    const api = getTestApi([pausedSeed]);

    const result = await api.cancelSubscriptionById('sub-1');

    expect(result.status).toBe(SUBSCRIPTION_CANCELLED);
  });

  it('vyhodí chybu pokud předplatné je již zrušeno', async () => {
    const cancelledSeed = { ...seedSubscription, status: SUBSCRIPTION_CANCELLED };
    const api = getTestApi([cancelledSeed]);

    await expect(api.cancelSubscriptionById('sub-1')).rejects.toThrow();
  });
});

describe('subscriptionApi — decrementSubscriptionDay', () => {
  it('odečte jeden den z aktivního předplatného', async () => {
    const api = getTestApi();

    const result = await api.decrementSubscriptionDay('sub-1');

    expect(result.remainingDays).toBe(19);
    expect(result.status).toBe(SUBSCRIPTION_ACTIVE);
  });

  it('přepne na EXPIRED pokud remainingDays dosáhne 0', async () => {
    const lastDaySeed = { ...seedSubscription, remainingDays: 1 };
    const api = getTestApi([lastDaySeed]);

    const result = await api.decrementSubscriptionDay('sub-1');

    expect(result.remainingDays).toBe(0);
    expect(result.status).toBe(SUBSCRIPTION_EXPIRED);
  });

  it('vyhodí chybu pokud předplatné není ACTIVE', async () => {
    const pausedSeed = { ...seedSubscription, status: SUBSCRIPTION_PAUSED };
    const api = getTestApi([pausedSeed]);

    await expect(api.decrementSubscriptionDay('sub-1')).rejects.toThrow();
  });
});
