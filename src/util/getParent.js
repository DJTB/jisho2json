/**
 * Traverses dom tree trying to find a particular element, giving up when document or limit is reached
 * @param  {HTMLElement} el HTML Element to begin traversing
 * @param  {String} selector target css selector, generally an id or class name
 * @param  {String} limit limit css selector
 * @return {HTMLElement|False} the target element or false
 */
export default function getParent(el, selector, limit) {
  const isElementNode = el.nodeType === 1;
  const limitReached = el === limit;
  const noMoreParents = !el.parentNode;

  if (isElementNode && el.matches(selector)) return el;
  if (limitReached || noMoreParents) return false;

  return el.parentNode ?
    getParent(el.parentNode, selector) : false;
}
