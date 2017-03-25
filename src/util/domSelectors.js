/**
 * Returns first element that matches CSS selector {selector}.
 * Querying can optionally be restricted to {container}’s descendants
 * @param {String} selector jQuery-like selector '#idNode' || '.classNode'
 * @param {HTMLElement} [container] html element to search inside
 * @returns {HTMLElement} DOM node
 */
export function domQs(selector = '', container = null) {
  return (container || document).querySelector(selector);
}

/**
 * Returns all elements that match CSS selector {selector} as an Array.
 * Querying can optionally be restricted to {container}’s descendants
 * @param {String} selector jQuery-like selector: '#idNode' || '.classNode'
 * @param {HTMLElement} [container] html element to search inside
 * @returns {Array} DOM nodes
 */
export function domQsa(selector = '', container = null) {
  return Array.from((container || document).querySelectorAll(selector));
}
