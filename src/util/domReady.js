/**
 * Fires callback when dom is ready
 * @param  {HTMLDocument} document dom
 * @param  {Function} callback whatchawannado
 */
export default function domReady(document, callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}
