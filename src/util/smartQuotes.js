const TRIPLE_PRIME = {
  regex: /'''/g,
  replacement: '\u2034', //
};
const START_DOUBLE = {
  regex: /(\W|^)"(\S)/g,
  replacement: '$1\u201c$2', // “
};
const END_DOUBLE = {
  regex: /(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g,
  replacement: '$1\u201d$2', // ”
};
const FINAL_DOUBLE = {
  regex: /([^0-9])"/g,
  replacement: '$1\u201d', // ”
};
const DOUBLE_PRIME = {
  regex: /''/g,
  replacement: '\u2033', // ″
};
const START_SINGLE = {
  regex: /(\W|^)'(\S)/g,
  replacement: '$1\u2018$2', // ‘
};
const POSSESSIVE_SINGLE = {
  regex: /([a-z])'([a-z])/ig,
  replacement: '$1\u2019$2', // ’
};
const END_SINGLE = {
  regex: /((\u2018[^']*)|[a-z])'([^0-9]|$)/ig,
  replacement: '$1\u2019$3', // ’
};
const YEAR_ABBREVIATION = {
  regex: /(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/ig,
  replacement: '\u2019$2$3', // ’
};
const BACKWARDS_APOSTROPHE = {
  regex: /(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/ig,
  replacement: '$1\u2019', // ’
};
const SINGLE_PRIME = {
  regex: /'/g,
  replacement: '\u2032', // ′
};

const PROCESSING_ORDER = [
  TRIPLE_PRIME,
  START_DOUBLE,
  END_DOUBLE,
  FINAL_DOUBLE,
  DOUBLE_PRIME,
  START_SINGLE,
  POSSESSIVE_SINGLE,
  END_SINGLE,
  YEAR_ABBREVIATION,
  BACKWARDS_APOSTROPHE,
  SINGLE_PRIME,
];

export default function smartQuotes(input = '') {
  return PROCESSING_ORDER.reduce((output, { regex, replacement }) => output.replace(regex, replacement), input);
}
