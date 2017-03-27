/* eslint-disable no-console */
import { ready, qs, qsa, writeStyle, findParent, findSibling, isNode, isTextNode } from './util/domHelpers';
import { jishoStyle } from './styles';
import smartQuotes from './util/smartQuotes';
import hasLength from './util/hasLength';
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
  MEANING_NOTE: '.supplemental_info .sense-tag',
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
      toaster.update(result);
      toaster.show();
    }
  };

  toaster.el.addEventListener('click', toaster.hide);
  document.body.addEventListener('keyup', ifKeyDo(keycodes.ESC, toaster.hide));
  document.body.addEventListener('click', onEntryClick);
}

function buildEntries(container) {
  const entries = qsa(selectors.MEANING, container)
    .map((element) => buildEntry(container, element))
    .filter((entry) => entry != null);

  /*
    TODO: need to allow user to choose to combine multiple meanings into a single meaning (perhaps very similar)
    TODO: need to allow user to add alternate readings to a meaning (like 伸びる & 延びる)
  */
  const otherForms = qsa(selectors.TAGS)
    .filter((tag) => tag.innerText.includes('other forms'))
    .shift();
  const otherFormsText = otherForms.nextSibling;
  const synonyms = otherFormsText ? parseSynonyms(otherForms) : null;
  console.log(synonyms);
  return JSON.stringify(entries, null, 2);
}

function buildEntry(container, element) {
  const counterNode = qs(selectors.MEANING_COUNTER, element);
  const tagsNode = findSibling(selectors.TAGS, element);
  const definitionNode = qs(selectors.MEANING_TEXT, element);
  const noteNodes = qsa(selectors.MEANING_NOTE, element);

  const counter = parseInt(getCleanText(counterNode), 10);
  const isMainDefinition = Number.isInteger(counter);

  if (!isMainDefinition) {
    return null;
  }

  return {
    counter,
    tags: getCleanText(tagsNode).split(', '),
    notes: parseNotes(noteNodes),
    meaning: getCleanText(definitionNode).split('; '),
    reading: buildReading(container, element),
  };
}

function parseNotes(elements) {
  // TODO: only allow/keep certain notes?
  // TODO: combine "other forms" that aren't "obsolete" into synonyms
  return elements.map(getCleanText).filter(hasLength);
}

function buildReading(container, element) {
  const character = getCleanText(qs(selectors.READING_CHARACTER, container));
  const kana = getCleanText(qs(selectors.READING_KANA, container));
  const sentenceEn = getCleanText(qs(selectors.SENTENCE_EN, element)) || '';
  const sentenceJa = qsa(selectors.SENTENCE_JA_MORPHEMES, element).map(getCleanText).join('');

  return {
    character,
    kana: parseKana(kana) || character, // sometimes character entry was hiragana and there is no 'kana'
    sentenceEn,
    sentenceJa,
    jlpt: getWordTag(container, 'jlpt'),
    common: getWordTag(container, 'common'),
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
  return (isNode(result) && result.innerText) || '';
}

function parseSynonyms(text) {
  // "八 【や】、８ 【はち】、８ 【や】、捌 【はち】、捌 【や】"
  const units = text.split(/、|、 /g);
  const result = units.map((x) => x.match(/(.*)(【.*】)/g));
  return result;
}

/**
 * Get text from node and transform quotes
 * @param  {String|HTMLElement|Text} input string | dom element | text node
 * @return {String} text
 */
function getCleanText(input) {
  let text = input;
  if (isNode(input)) text = input.innerText;
  if (isTextNode(input)) text = input.textContent;
  if (input == null || typeof text !== 'string') return '';

  return smartQuotes(text.trim());
}
