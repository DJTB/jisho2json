/**
 * Self explanatory.. check if Array or String has length
 * @param  {Any} x target
 * @return {Boolean}
 */
export default function hasLength(x) {
  return Object.hasOwnProperty.call(x, 'length') && x.length > 0;
}
