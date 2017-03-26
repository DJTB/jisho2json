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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var CLASSNAMES = exports.CLASSNAMES = {
  TOAST: 'toast',
  ENTRY: 'concept_light',
  VISIBLE: 'is--visible'
};

var ESC_KEYCODE = exports.ESC_KEYCODE = 27;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = __webpack_require__(0);

/**
 * css styles to be injected into head of jisho document
 * @type {String} css rules
 */
var styles = '\n   /* highlight clickable entries on hover */\n  .' + _constants.CLASSNAMES.ENTRY + ' {\n    transition: all .5s ease-in\n  }\n  .' + _constants.CLASSNAMES.ENTRY + ':hover {\n    transition: all .3s ease-out;\n    box-shadow: 0 0 4px 0 cornflowerblue;\n    cursor: pointer;\n  }\n  /* notification we will add to body */\n  .' + _constants.CLASSNAMES.TOAST + ' {\n    position: fixed;\n    top: .5rem;\n    right: .5rem;\n    bottom: .5rem;\n    left: .5rem;\n    padding: .5rem;\n    max-width: calc(100vw - 1rem);\n    max-height: calc(100vh - 1rem);\n    overflow: auto;\n    font-size: 1.2rem;\n    opacity: 0;\n    margin: 0 .3rem;\n    border: 4px solid gainsboro;\n    border-radius: 5px;\n    background-color: cornflowerblue;\n    color: whitesmoke;\n    cursor: pointer;\n    z-index: 100; /* jisho overlay is at 95 already */\n    /* <pre> formatting */\n    white-space: pre-wrap;\n    word-wrap: break-word;\n    transition: opacity .35s ease-in;\n    /* disable clicks */\n    pointer-events: none;\n  }\n  .' + _constants.CLASSNAMES.TOAST + '.' + _constants.CLASSNAMES.VISIBLE + ' {\n    transition: opacity .25s ease-out;\n    pointer-events: initial;\n    opacity: .95;\n  }\n';

exports.default = styles;

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
exports.writeStyles = writeStyles;
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
 * @param  {String} [style=''] string representation of css styles
 */
function writeStyles() {
  var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var element = document.createElement('style');
  element.setAttribute('type', 'text/css');
  element.appendChild(document.createTextNode(style));
  document.head.appendChild(element);
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getParent;
/**
 * Traverses dom tree trying to find a particular element, giving up when document or limit is reached
 * @param  {HTMLElement} el HTML Element to begin traversing
 * @param  {String} selector target css selector, generally an id or class name
 * @param  {String} limit limit css selector
 * @return {HTMLElement|False} the target element or false
 */
function getParent(el, selector, limit) {
  var isElementNode = el.nodeType === 1;
  var limitReached = el === limit;
  var noMoreParents = !el.parentNode;

  if (isElementNode && el.matches(selector)) return el;
  if (limitReached || noMoreParents) return false;

  return el.parentNode ? getParent(el.parentNode, selector) : false;
}

/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint-disable no-console */


var _styles = __webpack_require__(1);

var _styles2 = _interopRequireDefault(_styles);

var _domHelpers = __webpack_require__(2);

var _getParent = __webpack_require__(3);

var _getParent2 = _interopRequireDefault(_getParent);

var _smartQuotes = __webpack_require__(4);

var _smartQuotes2 = _interopRequireDefault(_smartQuotes);

var _constants = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: put in constants when dev done
var SELECTORS = {
  ENTRIES: '#primary',
  ENTRY: '.' + _constants.CLASSNAMES.ENTRY
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
  console.info('jisho2json loaded');
  (0, _domHelpers.writeStyles)(_styles2.default);

  var toaster = renderToast();

  toaster.updateText('wubbadubadubadubdub');
  toaster.show();

  var onEntryClick = function onEntryClick(_ref2) {
    var target = _ref2.target;

    var entryJSON = copyEntry(target);
    // voodoo magic in order to copy to keyboard via background page
    chrome.extension.sendMessage({ text: entryJSON }); // eslint-disable-line no-undef

    // notify copied data
    console.info('Copied:\n', entryJSON);
    toaster.updateText(entryJSON);
    toaster.show();
  };

  toaster.el.addEventListener('click', toaster.show);
  toaster.el.addEventListener('keyup', ifKeyDo(_constants.ESC_KEYCODE, toaster.hide));
  document.body.addEventListener('click', onEntryClick);
}

function copyEntry(target) {
  var desiredTargetSelector = SELECTORS.ENTRY;
  var limit = document.getElementById(SELECTORS.ENTRIES);
  // click target could be a child of entry, walk up dom tree until parent "limit" looking for entry
  var jishoEntry = (0, _getParent2.default)(target, desiredTargetSelector, limit);
  return buildEntry(jishoEntry);
}

function renderToast() {
  var toast = document.createElement('pre');

  Object.assign(toast, {
    className: _constants.CLASSNAMES.TOAST,
    textContent: 'jisho2json loaded'
  });

  var el = document.body.appendChild(toast);

  return {
    el: el,
    show: function show() {
      return el.classList.toggle(_constants.CLASSNAMES.VISIBLE, true);
    },
    hide: function hide() {
      return el.classList.toggle(_constants.CLASSNAMES.VISIBLE, false);
    },
    updateText: function updateText(text) {
      el.textContent = text;
    }
  };
}

function buildEntry(element) {
  var meanings = buildMeanings(element); // parseMeanings(element)
  var readings = buildReadings(element);

  var entry = [{
    meanings: meanings, // []
    readings: readings }];

  return JSON.stringify(entry, null, 2);
}

function buildReadings(element) {
  var character = parseKanji(element);
  return [{
    character: character,
    kana: parseKana(element) || character, // sometimes character entry was hiragana and there is no 'kana'
    level: '7',
    tags: ['Noun'],
    sentence: parseSentence(element),
    jlpt: getJlpt(element),
    common: isCommon(element)
  }];
}

function isCommon(element) {
  return !!element.querySelector('.concept_light-common').length;
}

function getJlpt(element) {
  return (0, _domHelpers.qsa)('.concept_light-tag', element).filter(function (node) {
    return node.innerText.includes('JLPT');
  }).map(function (node) {
    return node.innerText;
  }) || null;
}

function parseKana(element) {
  var re = /(?!\b)\W+$/;
  var kana = (0, _domHelpers.qs)('.f-dropdown li:nth-of-type(2)', element); // FIXME: does selector work outside jQuery?

  var _ref3 = getText(kana).match(re) || [],
      _ref4 = _slicedToArray(_ref3, 1),
      kanaText = _ref4[0];

  return kanaText;
}

function parseKanji(element) {
  return getText((0, _domHelpers.qs)('.text', element));
}

function buildMeanings(element) {
  var defs = [];
  var defNodes = (0, _domHelpers.qsa)('.meaning-wrapper', element).filter(function (node) {
    return node.innerText.includes('Wikipedia');
  }); // might have to check siblings?

  defNodes.forEach(function (el) {
    var tags = parseTags(el);

    // only numbered meanings have this class followed by meaning text
    var target = (0, _domHelpers.qs)('.meaning-definition-section_divider + span', el);
    var meanings = getText(target).split('; ');

    if (meanings.length) {
      defs.push({
        meanings: meanings,
        notes: parseInfo(el),
        tags: tags,
        sentence: parseSentence(el)
      });
    }
  });

  return defs;
}

function parseTags(element) {
  var tags = (0, _domHelpers.qs)('.meaning-tags', element.previousElementSibling());
  var tagText = getText(tags);
  return tags === '' ? [] : tagText.split(', ');
}

function parseSentence(element) {
  var sentenceNodes = Array.from((0, _domHelpers.qs)('', element).children);
  var jaSentence = sentenceNodes.filter(function (child) {
    return !child.classList.contains('english');
  });
  var enSentence = sentenceNodes.filter(function (child) {
    return child.classList.contains('english');
  });
  // smartQuotes($(x).find('.unlinked').text())
  // smartQuotes($(x).find('.english').text())
  return {
    ja: jaSentence,
    en: enSentence
  };
}

function parseInfo(element) {
  return (0, _domHelpers.qsa)('.supplemental_info .tag-tag', element).map(getText);
}

function getText(node) {
  return (0, _smartQuotes2.default)(node.innerText.trim());
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=jisho2json.js.map