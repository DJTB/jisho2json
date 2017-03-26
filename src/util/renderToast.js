import { classnames } from '../constants';
import { toastStyle } from '../styles';
import { writeStyle } from './domHelpers';

/**
 * Renders a notification toast element, writes styles to document head, returns api
 * @return [{ el: HTMLElement, update: Function, show: Function, hide: Function }] api for controlling toast
 */
export default function renderToast() {
  writeStyle(toastStyle);
  const pre = document.createElement('pre');

  Object.assign(pre, {
    className: classnames.TOAST,
    textContent: 'jisho2json loaded',
  });

  const el = document.body.appendChild(pre);
  let pendingFade;

  function update(html) {
    el.innerHtml = html;
  }

  function show() {
    el.classList.toggle(classnames.VISIBLE, true);
    clearTimeout(pendingFade);
  }

  function hide(delay = 0) {
    pendingFade = setTimeout(() => {
      el.classList.toggle(classnames.VISIBLE, false);
    }, delay);
  }

  return {
    el,
    update,
    show,
    hide,
  };
}
