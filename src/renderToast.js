import { CLASSNAMES } from './constants';

export default function renderToast() {
  const toast = document.createElement('pre');

  Object.assign(toast, {
    className: CLASSNAMES.TOAST,
    textContent: 'jisho2json loaded',
  });

  const el = document.body.appendChild(toast);
  let pendingFade;

  const updateText = (text) => {
    el.textContent = text;
  };
  const show = () => {
    el.classList.toggle(CLASSNAMES.VISIBLE, true);
    clearTimeout(pendingFade);
  };
  const hide = (delay = 0) => {
    pendingFade = setTimeout(() => {
      el.classList.toggle(CLASSNAMES.VISIBLE, false);
    }, delay);
  };

  return {
    el,
    updateText,
    show,
    hide,
  };
}
