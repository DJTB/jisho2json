/* eslint-disable no-console */
import styles from './styles';
import { ready, qs, qsa, writeStyles } from './util/domHelpers';
import getParent from './util/getParent';
import smartQuotes from './util/smartQuotes';
import { ESC_KEYCODE, CLASSNAMES } from './constants';

// TODO: put in constants when dev done
const SELECTORS = {
  ENTRIES: '#primary',
  ENTRY: `.${CLASSNAMES.ENTRY}`,
};

const ifKeyDo = (key, callback) => ({ keyCode }) => {
  if (keyCode === key) callback();
};

// blastoff!
ready(init);

function init() {
  console.info('jisho2json loaded');
  writeStyles(styles);

  const toaster = renderToast();

  toaster.updateText('wubbadubadubadubdub');
  toaster.show();

  const onEntryClick = ({ target }) => {
    const entryJSON = copyEntry(target);
    // voodoo magic in order to copy to keyboard via background page
    chrome.extension.sendMessage({ text: entryJSON }); // eslint-disable-line no-undef

    // notify copied data
    console.info('Copied:\n', entryJSON);
    toaster.updateText(entryJSON);
    toaster.show();
  };

  toaster.el.addEventListener('click', toaster.show);
  toaster.el.addEventListener('keyup', ifKeyDo(ESC_KEYCODE, toaster.hide));
  document.body.addEventListener('click', onEntryClick);
}

function copyEntry(target) {
  const desiredTargetSelector = SELECTORS.ENTRY;
  const limit = document.getElementById(SELECTORS.ENTRIES);
  // click target could be a child of entry, walk up dom tree until parent "limit" looking for entry
  const jishoEntry = getParent(target, desiredTargetSelector, limit);
  return buildEntry(jishoEntry);
}

function renderToast() {
  const toast = document.createElement('pre');

  Object.assign(toast, {
    className: CLASSNAMES.TOAST,
    textContent: 'jisho2json loaded',
  });

  const el = document.body.appendChild(toast);

  return {
    el,
    show: () => el.classList.toggle(CLASSNAMES.VISIBLE, true),
    hide: () => el.classList.toggle(CLASSNAMES.VISIBLE, false),
    updateText: (text) => { el.textContent = text; },
  };
}


function buildEntry(element) {
  const meanings = buildMeanings(element); // parseMeanings(element)
  const readings = buildReadings(element);

  const entry = [{
    meanings, // []
    readings, // []
  }];

  return JSON.stringify(entry, null, 2);
}

function buildReadings(element) {
  const character = parseKanji(element);
  return [{
    character,
    kana: parseKana(element) || character, // sometimes character entry was hiragana and there is no 'kana'
    level: '7',
    tags: ['Noun'],
    sentence: parseSentence(element),
    jlpt: getJlpt(element),
    common: isCommon(element),
  }];
}

function isCommon(element) {
  return !!element.querySelector('.concept_light-common').length;
}

function getJlpt(element) {
  return qsa('.concept_light-tag', element)
    .filter((node) => node.innerText.includes('JLPT'))
    .map((node) => node.innerText) || null;
}


function parseKana(element) {
  const re = /(?!\b)\W+$/;
  const kana = qs('.f-dropdown li:nth-of-type(2)', element); // FIXME: does selector work outside jQuery?
  const [kanaText] = (getText(kana).match(re) || []);
  return kanaText;
}

function parseKanji(element) {
  return getText(qs('.text', element));
}

function buildMeanings(element) {
  const defs = [];
  const defNodes = qsa('.meaning-wrapper', element).filter((node) => node.innerText.includes('Wikipedia')); // might have to check siblings?

  defNodes.forEach((el) => {
    const tags = parseTags(el);

    // only numbered meanings have this class followed by meaning text
    const target = qs('.meaning-definition-section_divider + span', el);
    const meanings = getText(target).split('; ');

    if (meanings.length) {
      defs.push({
        meanings,
        notes: parseInfo(el),
        tags,
        sentence: parseSentence(el),
      });
    }
  });

  return defs;
}

function parseTags(element) {
  const tags = qs('.meaning-tags', element.previousElementSibling());
  const tagText = getText(tags);
  return tags === '' ? [] : tagText.split(', ');
}

function parseSentence(element) {
  const sentenceNodes = Array.from(qs('', element).children);
  const jaSentence = sentenceNodes.filter((child) => !child.classList.contains('english'));
  const enSentence = sentenceNodes.filter((child) => child.classList.contains('english'));
  // smartQuotes($(x).find('.unlinked').text())
  // smartQuotes($(x).find('.english').text())
  return {
    ja: jaSentence,
    en: enSentence,
  };
}

function parseInfo(element) {
  return qsa('.supplemental_info .tag-tag', element).map(getText);
}

function getText(node) {
  return smartQuotes(node.innerText.trim());
}
