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
 * @param  {String} [style] string representation of css styles
 */
export function writeStyle(style) {
  if (!style) return;
  const element = document.createElement('style');
  element.setAttribute('type', 'text/css');
  element.appendChild(document.createTextNode(style));
  document.head.appendChild(element);
}

/**
 * Returns the first parent that matches selector, exiting if limit or document is reached
 * @param  {String} selector target css selector, generally an id or class name
 * @param  {HTMLElement} el HTML Element to begin traversing
 * @param  {String} limit limit css selector
 * @return {HTMLElement|Null} the target element or null
 */
export function findParent(selector, el, limit) {
  const isElementNode = el.nodeType === 1;
  const limitReached = el === limit;

  if (isElementNode && el.matches(selector)) return el;

  return (!limitReached && el.parentNode) ? findParent(selector, el.parentNode) : null;
}

/**
 * Returns the first sibling that matches selector
 * @param  {String} selector target css selector, generally an id or class name
 * @param  {HTMLElement} el HTML Element to begin traversing
 * @return {HTMLElement|Null} the target element or null
 */
export function findSibling(selector, el) {
  if (el.matches(selector)) return el;
  return el.previousSibling ? findSibling(selector, el.previousSibling) : null;
}

const hasNodeType = (node) => node != null && Number.isInteger(node.nodeType);
export const isNode = (node) => hasNodeType(node) && node.nodeType === 1;
export const isTextNode = (node) => hasNodeType(node) && node.nodeType === 3;
