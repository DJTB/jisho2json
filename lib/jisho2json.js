(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jisho2json"] = factory();
	else
		root["jisho2json"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var classnames = exports.classnames = {
  TOAST: 'toast',
  ENTRY: 'concept_light',
  VISIBLE: 'is--visible'
};

var keycodes = exports.keycodes = {
  ESC: 27
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toastStyle = exports.jishoStyle = undefined;

var _constants = __webpack_require__(0);

var primaryColorRGB = '100, 150, 240';
var primaryColor = 'rgb(' + primaryColorRGB + ')';

/**
 * css styles to be injected into head of jisho document
 * @type {String} css rules
 */
var jishoStyle = exports.jishoStyle = '\n   /* highlight clickable entries on hover */\n  .' + _constants.classnames.ENTRY + ' {\n    transition: all .5s ease-in\n  }\n  .' + _constants.classnames.ENTRY + ':hover {\n    transition: all .3s ease-out;\n    box-shadow: 0 0 4px 0 ' + primaryColor + ';\n    cursor: pointer;\n  }\n';

var toastStyle = exports.toastStyle = '\n  /* notification we will add to body */\n  .' + _constants.classnames.TOAST + ' {\n    position: fixed;\n    font-size: 18px;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    margin: 0;\n    padding: .25em;\n    max-width: calc(100vw);\n    max-height: calc(50vh);\n    overflow: auto;\n    opacity: 0;\n    background-color: whitesmoke;\n    border: 4px solid rgba(' + primaryColorRGB + ', .6);\n    border-top-color: rgba(' + primaryColorRGB + ', .8);\n    color: #444;\n    cursor: pointer;\n    z-index: 100; /* jisho overlay is at 95 already */\n    /* <pre> formatting */\n    white-space: pre-wrap;\n    word-wrap: break-word;\n    transition: opacity .35s ease-in;\n    /* disable clicks */\n    pointer-events: none;\n  }\n  .' + _constants.classnames.TOAST + '.' + _constants.classnames.VISIBLE + ' {\n    transition: opacity .25s ease-out;\n    pointer-events: initial;\n    opacity: .95;\n  }\n';

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ready = ready;
exports.qs = qs;
exports.qsa = qsa;
exports.writeStyle = writeStyle;
exports.findParent = findParent;
exports.findSibling = findSibling;
/**
 * Fires callback when document object is ready
 * @param  {Function} callback whatchawannado
 * @param  {HTMLDocument} [dom] optional virtual document (jsdom etc)
 */
function ready(callback, dom) {
  var page = dom || document;
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
function qs() {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  return (container || document).querySelector(selector);
}

/**
 * Returns all elements that match CSS selector {selector} as an Array.
 * Querying can optionally be restricted to {container}’s descendants
 * @param {String} selector jQuery-like selector: '#idNode' || '.classNode'
 * @param {HTMLElement} [container] html element to search inside
 * @returns {Array} DOM nodes
 */
function qsa() {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  return Array.from((container || document).querySelectorAll(selector));
}

/**
 * Writes <style> tag and appends to document <head>
 * @param  {String} [style] string representation of css styles
 */
function writeStyle(style) {
  if (!style) return;
  var element = document.createElement('style');
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
function findParent(selector, el, limit) {
  var isElementNode = el.nodeType === 1;
  var limitReached = el === limit;

  if (isElementNode && el.matches(selector)) return el;

  return !limitReached && el.parentNode ? findParent(selector, el.parentNode) : null;
}

/**
 * Returns the first sibling that matches selector
 * @param  {String} selector target css selector, generally an id or class name
 * @param  {HTMLElement} el HTML Element to begin traversing
 * @return {HTMLElement|Null} the target element or null
 */
function findSibling(selector, el) {
  if (el.matches(selector)) return el;
  return el.previousSibling ? findSibling(selector, el.previousSibling) : null;
}

var hasNodeType = function hasNodeType(node) {
  return node != null && Number.isInteger(node.nodeType);
};
var isNode = exports.isNode = function isNode(node) {
  return hasNodeType(node) && node.nodeType === 1;
};
var isTextNode = exports.isTextNode = function isTextNode(node) {
  return hasNodeType(node) && node.nodeType === 3;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hasLength;
/**
 * Self explanatory.. check if Array or String has length
 * @param  {Any} x target
 * @return {Boolean}
 */
function hasLength(x) {
  return Object.hasOwnProperty.call(x, 'length') && x.length > 0;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderToast;

var _constants = __webpack_require__(0);

var _styles = __webpack_require__(1);

var _domHelpers = __webpack_require__(2);

/**
 * Renders a notification toast element, writes styles to document head, returns api
 * @return [{ el: HTMLElement, update: Function, show: Function, hide: Function }] api for controlling toast
 */
function renderToast() {
  (0, _domHelpers.writeStyle)(_styles.toastStyle);
  var pre = document.createElement('pre');

  Object.assign(pre, {
    className: _constants.classnames.TOAST,
    textContent: 'jisho2json loaded'
  });

  var el = document.body.appendChild(pre);
  var pendingFade = void 0;

  function update(html) {
    el.innerText = html;
  }

  function show() {
    el.classList.toggle(_constants.classnames.VISIBLE, true);
    clearTimeout(pendingFade);
  }

  function hide() {
    var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    pendingFade = setTimeout(function () {
      el.classList.toggle(_constants.classnames.VISIBLE, false);
    }, delay);
  }

  return {
    el: el,
    update: update,
    show: show,
    hide: hide
  };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = smartQuotes;
var TRIPLE_PRIME = {
  regex: /'''/g,
  replacement: '\u2034' };
var START_DOUBLE = {
  regex: /(\W|^)"(\S)/g,
  replacement: '$1\u201C$2' };
var END_DOUBLE = {
  regex: /(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g,
  replacement: '$1\u201D$2' };
var FINAL_DOUBLE = {
  regex: /([^0-9])"/g,
  replacement: '$1\u201D' };
var DOUBLE_PRIME = {
  regex: /''/g,
  replacement: '\u2033' };
var START_SINGLE = {
  regex: /(\W|^)'(\S)/g,
  replacement: '$1\u2018$2' };
var POSSESSIVE_SINGLE = {
  regex: /([a-z])'([a-z])/ig,
  replacement: '$1\u2019$2' };
var END_SINGLE = {
  regex: /((\u2018[^']*)|[a-z])'([^0-9]|$)/ig,
  replacement: '$1\u2019$3' };
var YEAR_ABBREVIATION = {
  regex: /(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/ig,
  replacement: '\u2019$2$3' };
var BACKWARDS_APOSTROPHE = {
  regex: /(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/ig,
  replacement: '$1\u2019' };
var SINGLE_PRIME = {
  regex: /'/g,
  replacement: '\u2032' };

var PROCESSING_ORDER = [TRIPLE_PRIME, START_DOUBLE, END_DOUBLE, FINAL_DOUBLE, DOUBLE_PRIME, START_SINGLE, POSSESSIVE_SINGLE, END_SINGLE, YEAR_ABBREVIATION, BACKWARDS_APOSTROPHE, SINGLE_PRIME];

function smartQuotes() {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return PROCESSING_ORDER.reduce(function (output, _ref) {
    var regex = _ref.regex,
        replacement = _ref.replacement;
    return output.replace(regex, replacement);
  }, input);
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint-disable no-console */


var _domHelpers = __webpack_require__(2);

var _styles = __webpack_require__(1);

var _smartQuotes = __webpack_require__(5);

var _smartQuotes2 = _interopRequireDefault(_smartQuotes);

var _hasLength = __webpack_require__(3);

var _hasLength2 = _interopRequireDefault(_hasLength);

var _renderToast = __webpack_require__(4);

var _renderToast2 = _interopRequireDefault(_renderToast);

var _constants = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: put in constants when dev done
var selectors = {
  TOAST: '.' + _constants.classnames.TOAST,
  ENTRIES: '#primary',
  ENTRY: '.' + _constants.classnames.ENTRY,
  MEANINGS: '.meanings-wrapper',
  TAGS: '.meaning-tags',
  MEANING: '.meaning-wrapper',
  MEANING_COUNTER: '.meaning-definition-section_divider',
  MEANING_TEXT: '.meaning-meaning',
  MEANING_NOTE: '.supplemental_info .sense-tag',
  MEANING_SENTENCE: '.sentence ul',
  SENTENCE_EN: '.english',
  SENTENCE_JA_MORPHEMES: 'li > span:not(.english):not(.furigana)',
  READING_CHARACTER: '.text',
  READING_KANA: '.f-dropdown li:nth-of-type(2)', // only safe place for unsplit/whole kana
  WORD_TAGS: '.concept_light-tag'
};

var ifKeyDo = function ifKeyDo(key, callback) {
  return function (_ref) {
    var keyCode = _ref.keyCode;

    if (keyCode === key) callback();
  };
};

// blastoff!
(0, _domHelpers.ready)(init);

function init() {
  (0, _domHelpers.writeStyle)(_styles.jishoStyle);
  var toaster = (0, _renderToast2.default)();
  console.info('jisho2json loaded');

  var onEntryClick = function onEntryClick(_ref2) {
    var target = _ref2.target;

    // click target could be a child of entry, walk up dom tree until parent "limit" looking for entry
    var limit = (0, _domHelpers.qs)(selectors.ENTRIES);
    var jishoEntry = (0, _domHelpers.findParent)(selectors.ENTRY, target, limit);

    if (jishoEntry) {
      var result = buildEntries(jishoEntry);
      // voodoo magic in order to copy to keyboard via background page
      chrome.extension.sendMessage({ text: result }); // eslint-disable-line no-undef

      // notify copied data
      console.info('Copied:\n', result);
      toaster.update(result);
      toaster.show();
    }
  };

  toaster.el.addEventListener('click', toaster.hide);
  document.body.addEventListener('keyup', ifKeyDo(_constants.keycodes.ESC, toaster.hide));
  document.body.addEventListener('click', onEntryClick);
}

function buildEntries(container) {
  var entries = (0, _domHelpers.qsa)(selectors.MEANING, container).map(function (element) {
    return buildEntry(container, element);
  }).filter(function (entry) {
    return entry != null;
  });

  /*
    TODO: need to allow user to choose to combine multiple meanings into a single meaning (perhaps very similar)
    TODO: need to allow user to add alternate readings to a meaning (like 伸びる & 延びる)
  */
  var otherForms = (0, _domHelpers.qsa)(selectors.TAGS).filter(function (tag) {
    return tag.innerText.includes('other forms');
  }).shift();
  var otherFormsText = otherForms.nextSibling;
  var synonyms = otherFormsText ? parseSynonyms(otherForms) : null;
  console.log(synonyms);
  return JSON.stringify(entries, null, 2);
}

function buildEntry(container, element) {
  var counterNode = (0, _domHelpers.qs)(selectors.MEANING_COUNTER, element);
  var tagsNode = (0, _domHelpers.findSibling)(selectors.TAGS, element);
  var definitionNode = (0, _domHelpers.qs)(selectors.MEANING_TEXT, element);
  var noteNodes = (0, _domHelpers.qsa)(selectors.MEANING_NOTE, element);

  var counter = parseInt(getCleanText(counterNode), 10);
  var isMainDefinition = Number.isInteger(counter);

  if (!isMainDefinition) {
    return null;
  }

  return {
    counter: counter,
    tags: getCleanText(tagsNode).split(', '),
    notes: parseNotes(noteNodes),
    meaning: getCleanText(definitionNode).split('; '),
    reading: buildReading(container, element)
  };
}

function parseNotes(elements) {
  // TODO: only allow/keep certain notes?
  // TODO: combine "other forms" that aren't "obsolete" into synonyms
  return elements.map(getCleanText).filter(_hasLength2.default);
}

function buildReading(container, element) {
  var character = getCleanText((0, _domHelpers.qs)(selectors.READING_CHARACTER, container));
  var kana = getCleanText((0, _domHelpers.qs)(selectors.READING_KANA, container));
  var sentenceEn = getCleanText((0, _domHelpers.qs)(selectors.SENTENCE_EN, element)) || '';
  var sentenceJa = (0, _domHelpers.qsa)(selectors.SENTENCE_JA_MORPHEMES, element).map(getCleanText).join('');

  return {
    character: character,
    kana: parseKana(kana) || character, // sometimes character entry was hiragana and there is no 'kana'
    sentenceEn: sentenceEn,
    sentenceJa: sentenceJa,
    jlpt: getWordTag(container, 'jlpt'),
    common: getWordTag(container, 'common')
  };
}

function parseKana(kana) {
  var re = /(?!\b)\W+$/; // last word in "Sentence search for かな"

  var _ref3 = kana.match(re) || [],
      _ref4 = _slicedToArray(_ref3, 1),
      kanaText = _ref4[0];

  return kanaText;
}

function getWordTag(element, word) {
  var result = (0, _domHelpers.qsa)(selectors.WORD_TAGS, element).filter(function (el) {
    return el.innerText.includes(word);
  }).shift();
  return (0, _domHelpers.isNode)(result) && result.innerText || '';
}

function parseSynonyms(text) {
  // "八 【や】、８ 【はち】、８ 【や】、捌 【はち】、捌 【や】"
  var units = text.split(/、|、 /g);
  var result = units.map(function (x) {
    return x.match(/(.*)(【.*】)/g);
  });
  return result;
}

/**
 * Get text from node and transform quotes
 * @param  {String|HTMLElement|Text} input string | dom element | text node
 * @return {String} text
 */
function getCleanText(input) {
  var text = input;
  if ((0, _domHelpers.isNode)(input)) text = input.innerText;
  if ((0, _domHelpers.isTextNode)(input)) text = input.textContent;
  if (input == null || typeof text !== 'string') return '';

  return (0, _smartQuotes2.default)(text.trim());
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=jisho2json.js.map