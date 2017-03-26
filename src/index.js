/* eslint-disable no-console */
import { ready, qs, qsa, writeStyle, findParent, findSibling } from './util/domHelpers';
import { jishoStyle } from './styles';
import smartQuotes from './util/smartQuotes';
import renderToast from './util/renderToast';
import { keycodes, classnames } from './constants';

// TODO: put in constants when dev done
const selectors = {
  TOAST: `.${classnames.TOAST}`,
  ENTRIES: '#primary',
  ENTRY: `.${classnames.ENTRY}`,
  MEANINGS: '.meanings-wrapper',
  TAGS: '.meaning-tags',
  MEANING: '.meaning-wrapper',
  MEANING_COUNTER: '.meaning-definition-section_divider',
  MEANING_TEXT: '.meaning-meaning',
  MEANING_INFO: '.supplemental_info .sense-tag',
  MEANING_SENTENCE: '.sentence ul',
  SENTENCE_EN: '.english',
  SENTENCE_JA_MORPHEMES: 'li > span:not(.english):not(.furigana)',
  READING_CHARACTER: '.text',
  READING_KANA: '.f-dropdown li:nth-of-type(2)', // only safe place for unsplit/whole kana
  WORD_TAGS: '.concept_light-tag',
};

const ifKeyDo = (key, callback) => ({ keyCode }) => {
  if (keyCode === key) callback();
};

// blastoff!
ready(init);

function init() {
  writeStyle(jishoStyle);
  const toaster = renderToast();
  console.info('jisho2json loaded');

  const onEntryClick = ({ target }) => {
    // click target could be a child of entry, walk up dom tree until parent "limit" looking for entry
    const limit = qs(selectors.ENTRIES);
    const jishoEntry = findParent(selectors.ENTRY, target, limit);

    if (jishoEntry) {
      const result = buildEntries(jishoEntry);
      // voodoo magic in order to copy to keyboard via background page
      chrome.extension.sendMessage({ text: result }); // eslint-disable-line no-undef

      // notify copied data
      console.info('Copied:\n', result);
      toaster.updateText(result);
      toaster.show();
    }
  };

  toaster.el.addEventListener('click', toaster.hide);
  document.body.addEventListener('keyup', ifKeyDo(keycodes.ESC, toaster.hide));
  document.body.addEventListener('click', onEntryClick);
}

function buildEntries(element) {
  const entries = qsa(selectors.MEANING, element)
    .map((el) =>
      buildEntry({
        element,
        tags: findSibling(selectors.TAGS, el),
        counter: qs(selectors.MEANING_COUNTER, el), // if no counter, it's a nonstandard meaning/info thin,
        definition: qs(selectors.MEANING_TEXT, el),
        info: qsa(selectors.MEANING_INFO, el),
        sentence: qs(selectors.MEANING_SENTENCE, el),
      }));

  return JSON.stringify(entries, null, 2);
}

function buildEntry({ element, tags, counter, definition, info, sentence }) {
  const ordinal = parseInt(getCleanText(counter), 10);
  const lexemes = getCleanText(definition).split('; ');

  const type = (() => {
    const isWikipedia = tags.innerText.includes('Wikipedia');
    const isOther = tags.innerText.includes('Other forms');
    switch (true) {
      case (isWikipedia): return 'wiki';
      case (isOther): return 'other';
      case (!Number.isNaN(ordinal)): return 'standard';
      default: return 'unknown';
    }
  })();

  return {
    type,
    tags: getCleanText(tags).split(', '),
    meaning: lexemes,
    reading: buildReading(element),
    notes: parseInfo(info),
    sentence: parseSentence(sentence),
  };
}

function parseInfo(elements) {
  // TODO: only allow/keep certain info?
  // TODO: regex /Only applies to (<reading>)/ to later on map specfic vocab readings to this meaning?
  return elements.map(getCleanText);
}

function parseSentence(element) {
  if (element) {
    const en = qs(selectors.SENTENCE_EN, element);
    const ja = qsa(selectors.SENTENCE_JA_MORPHEMES, element)
      .map((node) => node.innerText)
      .join('');

    return {
      en: getCleanText(en),
      ja: getCleanText(ja),
    };
  }
  return null;
}

function buildReading(element) {
  const character = getCleanText(qs(selectors.READING_CHARACTER, element));
  const kanaEl = qs(selectors.READING_KANA, element);
  const kana = getCleanText(kanaEl);

  return {
    character,
    kana: parseKana(kana) || character, // sometimes character entry was hiragana and there is no 'kana'
    sentence: parseSentence(element),
    jlpt: getWordTag(element, 'jlpt'),
    common: getWordTag(element, 'common'),
  };
}

function parseKana(kana) {
  const re = /(?!\b)\W+$/; // last word in "Sentence search for かな"
  const [kanaText] = (kana.match(re) || []);
  return kanaText;
}

function getWordTag(element, word) {
  const result = qsa(selectors.WORD_TAGS, element)
    .filter((el) => el.innerText.includes(word))
    .shift();
  return (result && result.innerText) || null;
}

/**
 * Get text and transform quotes
 * @param  {String|HTMLElement|Text} input string | dom element | text node
 * @return {String} text
 */
function getCleanText(input) {
  if (input == null) return null;
  const isNode = input.nodeType === 1;
  const isTextNode = input.nodetype === 3;
  const text = ((isNode && input.innerText) || (isTextNode && input.textContent) || input).trim();
  return smartQuotes(text);
}
