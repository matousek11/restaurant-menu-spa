import { describe, it, expect } from 'vitest';
import { createStore } from '../../../../src/infra/store/createStore.js';
import { createInitialState } from '../../../../src/app/state.js';
import { getSubscriptionApi } from '../../../../src/api/subscriptionApi.js';
import { enterSubscriptionsAction } from '../../../../src/app/actions/enterSubscriptionsAction.js';
import { enterSubscriptionDetailAction } from '../../../../src/app/actions/enterSubscriptionDetailAction.js';
import { enterSubscriptionCreateAction } from '../../../../src/app/actions/enterSubscriptionCreateAction.js';
import { createSubscriptionAction } from '../../../../src/app/actions/createSubscriptionAction.js';
import { pauseSubscriptionAction } from '../../../../src/app/actions/pauseSubscriptionAction.js';
import { resumeSubscriptionAction } from '../../../../src/app/actions/resumeSubscriptionAction.js';
import { cancelSubscriptionAction } from '../../../../src/app/actions/cancelSubscriptionAction.js';
import { SUBSCRIPTION_ACTIVE, SUBSCRIPTION_PAUSED, SUBSCRIPTION_CANCELLED } from '../../../../src/app/subscription/subscriptionTransitions.js';

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

function createTestSetup(seed = []) {
  const store = createStore(createInitialState());
  const api = { subscription: getSubscriptionApi(seed, true) };
  return { store, api };
}

describe('enterSubscriptionsAction', () => {
  it('nastaví mode na SUBSCRIPTION_LIST', () => {
    const { store } = createTestSetup();

    enterSubscriptionsAction({ store });

    const state = store.getState();
    expect(state.ui.mode).toBe('SUBSCRIPTION_LIST');
    expect(state.ui.selectedSubscriptionId).toBeNull();
    expect(state.ui.status).toBe('READY');
  });
});

describe('enterSubscriptionDetailAction', () => {
  it('nastaví mode na SUBSCRIPTION_DETAIL a uloží id', () => {
    const { store } = createTestSetup();

    enterSubscriptionDetailAction({ store, payload: { subscriptionId: 'sub-1' } });

    const state = store.getState();
    expect(state.ui.mode).toBe('SUBSCRIPTION_DETAIL');
    expect(state.ui.selectedSubscriptionId).toBe('sub-1');
  });
});

describe('enterSubscriptionCreateAction', () => {
  it('nastaví mode na SUBSCRIPTION_CREATE', () => {
    const { store } = createTestSetup();

    enterSubscriptionCreateAction({ store });

    const state = store.getState();
    expect(state.ui.mode).toBe('SUBSCRIPTION_CREATE');
    expect(state.ui.selectedSubscriptionId).toBeNull();
  });
});

describe('createSubscriptionAction', () => {
  it('vytvoří předplatné a přidá ho do stavu', async () => {
    const { store, api } = createTestSetup([]);

    await createSubscriptionAction({ store, api, payload: { weekStartId: '2026-04-06', totalDays: 30 } });

    const state = store.getState();
    expect(state.subscriptions).toHaveLength(1);
    expect(state.subscriptions[0].status).toBe(SUBSCRIPTION_ACTIVE);
    expect(state.ui.status).toBe('READY');
    expect(state.ui.mode).toBe('SUBSCRIPTION_DETAIL');
  });

  it('nastaví ERROR pokud zákazník již má aktivní předplatné', async () => {
    const { store, api } = createTestSetup([seedSubscription]);

    await createSubscriptionAction({ store, api, payload: { weekStartId: '2026-04-13', totalDays: 30 } });

    const state = store.getState();
    expect(state.ui.status).toBe('ERROR');
    expect(state.ui.errorMessage).not.toBeNull();
  });
});

describe('pauseSubscriptionAction', () => {
  it('pozastaví aktivní předplatné', async () => {
    const { store, api } = createTestSetup([seedSubscription]);
    store.setState((s) => ({ ...s, subscriptions: [seedSubscription] }));

    await pauseSubscriptionAction({ store, api, payload: { subscriptionId: 'sub-1' } });

    const state = store.getState();
    expect(state.subscriptions[0].status).toBe(SUBSCRIPTION_PAUSED);
    expect(state.ui.status).toBe('READY');
  });

  it('nastaví ERROR při pokusu pozastavit neexistující předplatné', async () => {
    const { store, api } = createTestSetup([]);

    await pauseSubscriptionAction({ store, api, payload: { subscriptionId: 'neexistuje' } });

    const state = store.getState();
    expect(state.ui.status).toBe('ERROR');
  });
});

describe('resumeSubscriptionAction', () => {
  it('obnoví pozastavené předplatné', async () => {
    const pausedSeed = { ...seedSubscription, status: SUBSCRIPTION_PAUSED, pausedAt: new Date().toISOString() };
    const { store, api } = createTestSetup([pausedSeed]);
    store.setState((s) => ({ ...s, subscriptions: [pausedSeed] }));

    await resumeSubscriptionAction({ store, api, payload: { subscriptionId: 'sub-1' } });

    const state = store.getState();
    expect(state.subscriptions[0].status).toBe(SUBSCRIPTION_ACTIVE);
    expect(state.ui.status).toBe('READY');
  });
});

describe('cancelSubscriptionAction', () => {
  it('zruší aktivní předplatné', async () => {
    const { store, api } = createTestSetup([seedSubscription]);
    store.setState((s) => ({ ...s, subscriptions: [seedSubscription] }));

    await cancelSubscriptionAction({ store, api, payload: { subscriptionId: 'sub-1' } });

    const state = store.getState();
    expect(state.subscriptions[0].status).toBe(SUBSCRIPTION_CANCELLED);
    expect(state.ui.status).toBe('READY');
  });

  it('nastaví ERROR při pokusu zrušit již zrušené předplatné', async () => {
    const cancelledSeed = { ...seedSubscription, status: SUBSCRIPTION_CANCELLED };
    const { store, api } = createTestSetup([cancelledSeed]);

    await cancelSubscriptionAction({ store, api, payload: { subscriptionId: 'sub-1' } });

    const state = store.getState();
    expect(state.ui.status).toBe('ERROR');
  });
});
