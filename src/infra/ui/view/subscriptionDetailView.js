import { createButton } from '../ui-components/button.js';
import { createHeader } from '../ui-components/header.js';
import { createParagraph } from '../ui-components/paragraph.js';
import {
  ACTION_CANCEL_SUBSCRIPTION,
  ACTION_PAUSE_SUBSCRIPTION,
  ACTION_RESUME_SUBSCRIPTION,
} from '../../../constants.js';

/**
 * Detail konkrétního předplatného + akce (pause / resume / cancel).
 *
 * @param {{ subscription: object|null, canPause: boolean, canResume: boolean, canCancel: boolean }} viewState
 * @param {(action: { type: string, payload?: object }) => void} dispatch
 * @returns {HTMLDivElement}
 */
export function subscriptionDetailView(viewState, dispatch) {
  const root = document.createElement('div');

  root.appendChild(
    createButton('← Zpět na seznam', () => {
      window.location.hash = '#/subscriptions';
    }),
  );

  const s = viewState.subscription;
  if (!s) {
    root.appendChild(createHeader('Předplatné nenalezeno', 'h2'));
    return root;
  }

  root.appendChild(createHeader(`Předplatné ${s.id}`, 'h2'));
  root.appendChild(createParagraph(`Týden od: ${s.weekStartId}`));
  root.appendChild(createParagraph(`Stav: ${s.status}`));
  root.appendChild(
    createParagraph(`Zbývá ${s.remainingDays} z ${s.totalDays} dnů`),
  );

  const actions = document.createElement('div');

  if (viewState.canPause) {
    actions.appendChild(
      createButton('Pozastavit', () =>
        dispatch({
          type: ACTION_PAUSE_SUBSCRIPTION,
          payload: { subscriptionId: s.id },
        }),
      ),
    );
  }

  if (viewState.canResume) {
    actions.appendChild(
      createButton('Obnovit', () =>
        dispatch({
          type: ACTION_RESUME_SUBSCRIPTION,
          payload: { subscriptionId: s.id },
        }),
      ),
    );
  }

  if (viewState.canCancel) {
    actions.appendChild(
      createButton('Zrušit', () =>
        dispatch({
          type: ACTION_CANCEL_SUBSCRIPTION,
          payload: { subscriptionId: s.id },
        }),
      ),
    );
  }

  root.appendChild(actions);
  return root;
}
