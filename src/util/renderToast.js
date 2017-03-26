import { classnames } from '../constants';
import { toastStyle } from '../styles';
import { writeStyle } from './domHelpers';

export default function renderToast() {
  writeStyle(toastStyle);
  const toast = document.createElement('pre');

  Object.assign(toast, {
    className: classnames.TOAST,
    textContent: 'jisho2json loaded',
  });

  const el = document.body.appendChild(toast);
  let pendingFade;

  const updateText = (text) => {
    el.textContent = text;
  };
  const show = () => {
    el.classList.toggle(classnames.VISIBLE, true);
    clearTimeout(pendingFade);
  };
  const hide = (delay = 0) => {
    pendingFade = setTimeout(() => {
      el.classList.toggle(classnames.VISIBLE, false);
    }, delay);
  };

  return {
    el,
    updateText,
    show,
    hide,
  };
}
