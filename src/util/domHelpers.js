/**
 * Fires callback when document object is ready
 * @param  {Function} callback whatchawannado
 * @param  {HTMLDocument} [dom] optional virtual document (jsdom etc)
 */
export function ready(callback, dom) {
  const page = dom || document;
  if (page.readyState !== 'loading') {
    callback();
  } else {
    page.addEventListener('DOMContentLoaded', callback);
  }
}

/**
 * Returns first element that matches CSS selector {selector}.
 * Querying can optionally be restricted to {container}’s descendants
 * @param {String} selector jQuery-like selector '#idNode' || '.classNode'
 * @param {HTMLElement} [container] html element to search inside
 * @returns {HTMLElement} DOM node
 */
export function qs(selector = '', container = null) {
  return (container || document).querySelector(selector);
}

/**
 * Returns all elements that match CSS selector {selector} as an Array.
 * Querying can optionally be restricted to {container}’s descendants
 * @param {String} selector jQuery-like selector: '#idNode' || '.classNode'
 * @param {HTMLElement} [container] html element to search inside
 * @returns {Array} DOM nodes
 */
export function qsa(selector = '', container = null) {
  return Array.from((container || document).querySelectorAll(selector));
}

/**
 * Writes <style> tag and appends to document <head>
 * @param  {String} [style=''] string representation of css styles
 */
export function writeStyles(style = '') {
  const element = document.createElement('style');
  element.setAttribute('type', 'text/css');
  element.appendChild(document.createTextNode(style));
  document.head.appendChild(element);
}
