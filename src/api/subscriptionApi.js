// src/api/subscriptionApi.js

/**
 * Mock server API pro správu předplatných.
 *
 * - simuluje serverovou perzistenci v paměti
 * - simuluje asynchronní chování (latence)
 * - garantuje invarianty (jedno aktivní předplatné, existence záznamu)
 */

import {
  createSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  decrementRemainingDays,
  SUBSCRIPTION_ACTIVE,
  SUBSCRIPTION_PAUSED,
} from '../app/subscription/subscriptionTransitions.js';

const defaultSeedData = [
  {
    id: 'sub-1',
    userId: 'user-1',
    weekStartId: '2026-04-06',
    totalDays: 30,
    remainingDays: 20,
    status: SUBSCRIPTION_ACTIVE,
    createdAt: '2026-04-06T08:00:00.000Z',
    pausedAt: null,
    cancelledAt: null,
  },
];

/**
 * Factory funkce — vrací mock API pro předplatná.
 *
 * @param {Array} seedData - počáteční stav mock databáze
 * @param {boolean} skipDelay - přeskočit simulaci latence (pro testy)
 */
export function getSubscriptionApi(seedData = defaultSeedData, skipDelay = false) {
  let subscriptions = structuredClone(seedData);

  function delay(ms = 400) {
    const finalDelay = skipDelay ? 0 : ms;
    return new Promise((resolve) => setTimeout(resolve, finalDelay));
  }

  async function getSubscriptions() {
    await delay();
    return structuredClone(subscriptions);
  }

  async function addSubscription(userId, weekStartId, totalDays) {
    await delay();

    const hasActive = subscriptions.some(
      (s) =>
        s.userId === userId &&
        (s.status === SUBSCRIPTION_ACTIVE || s.status === SUBSCRIPTION_PAUSED),
    );
    if (hasActive) {
      throw new Error('BE: Zákazník již má aktivní nebo pozastavené předplatné');
    }

    const subscription = createSubscription(userId, weekStartId, totalDays);
    subscriptions.push(subscription);
    return structuredClone(subscription);
  }

  async function pauseSubscriptionById(id) {
    await delay();

    const subscription = subscriptions.find((s) => s.id === id);
    if (!subscription) {
      throw new Error('BE: Předplatné nenalezeno');
    }
    if (subscription.status !== SUBSCRIPTION_ACTIVE) {
      throw new Error('BE: Předplatné nelze pozastavit — není aktivní');
    }

    const updated = pauseSubscription(subscription);
    subscriptions = subscriptions.map((s) => (s.id === id ? updated : s));
    return structuredClone(updated);
  }

  async function resumeSubscriptionById(id) {
    await delay();

    const subscription = subscriptions.find((s) => s.id === id);
    if (!subscription) {
      throw new Error('BE: Předplatné nenalezeno');
    }
    if (subscription.status !== SUBSCRIPTION_PAUSED) {
      throw new Error('BE: Předplatné nelze obnovit — není pozastaveno');
    }

    const updated = resumeSubscription(subscription);
    subscriptions = subscriptions.map((s) => (s.id === id ? updated : s));
    return structuredClone(updated);
  }

  async function cancelSubscriptionById(id) {
    await delay();

    const subscription = subscriptions.find((s) => s.id === id);
    if (!subscription) {
      throw new Error('BE: Předplatné nenalezeno');
    }
    if (
      subscription.status !== SUBSCRIPTION_ACTIVE &&
      subscription.status !== SUBSCRIPTION_PAUSED
    ) {
      throw new Error('BE: Předplatné nelze zrušit — již je zrušeno nebo vypršelo');
    }

    const updated = cancelSubscription(subscription);
    subscriptions = subscriptions.map((s) => (s.id === id ? updated : s));
    return structuredClone(updated);
  }

  async function decrementSubscriptionDay(id) {
    await delay();

    const subscription = subscriptions.find((s) => s.id === id);
    if (!subscription) {
      throw new Error('BE: Předplatné nenalezeno');
    }
    if (subscription.status !== SUBSCRIPTION_ACTIVE) {
      throw new Error('BE: Dny lze odečítat pouze z aktivního předplatného');
    }

    const updated = decrementRemainingDays(subscription);
    subscriptions = subscriptions.map((s) => (s.id === id ? updated : s));
    return structuredClone(updated);
  }

  return {
    getSubscriptions,
    addSubscription,
    pauseSubscriptionById,
    resumeSubscriptionById,
    cancelSubscriptionById,
    decrementSubscriptionDay,
  };
}
