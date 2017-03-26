/**
 * Fires callback when document object is ready
 * @param  {HTMLDocument} document dom
 * @param  {Function} callback whatchawannado
 */
export default function ready(document, callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}
