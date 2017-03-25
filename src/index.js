/* eslint-disable no-console */
import styles from './styles';
import domReady from './util/domReady';
import { domQs, domQsa } from './util/domSelectors';
import getParent from './util/getParent';
import smartQuotes from './util/smartQuotes';

// blastoff!
domReady(init);

function init() {
  console.info('jisho2json loaded');
  let toaster; // notification element
  let pendingFade; // cancellable delayed fadeOut animation setTimeout timer

  appendStyleToHead(styles);

  renderToast().then((toast) => {
    toaster = toast;
    toaster.addEventListener('click', () => toaster.classList.remove('--isVisible'));
  }).catch(console.error);


  // parse and copy entry to clipboard
  domQs('body').addEventListener('click', ({ target }) => {
    const desiredTargetSelector = '.concept_light';
    const limit = document.getElementById('primary');
    // click target could be a child of entry, walk up dom tree until parent "limit" looking for entry
    const jishoEntry = getParent(target, desiredTargetSelector, limit);

    if (jishoEntry) {
      const entryJSON = JSON.stringify(buildEntry(jishoEntry), null, 2);

      // voodoo magic in order to copy to keyboard via background page
      chrome.extension.sendMessage({ text: entryJSON }); // eslint-disable-line no-undef

      // notify copied data
      console.info('Copied:\n', (entryJSON));
      toaster.textContent = entryJSON; // eslint-disable-line no-param-reassign
      toaster.classList.add('--isVisible');
      clearTimeout(pendingFade);
      pendingFade = setTimeout(() => toaster.classList.remove('--isVisible'), 5000);
    }
  });
}

function appendStyleToHead(style) {
  const element = document.createElement('style');
  element.setAttribute('type', 'text/css');
  element.appendChild(document.createTextNode(style));
  document.head.appendChild(element);
}

function renderToast() {
  return new Promise((resolve, reject) => {
    const toast = document.createElement('pre');
    Object.assign(toast, {
      className: 'toast',
      textContent: 'jisho2json loaded',
    });

    document.body.appendChild(toast);

    const toastEl = domQs('.toast');
    return toastEl ? resolve(toastEl) : reject(new Error('Toast element not added to body'));
  });
}


function buildEntry(element) {
  const meanings = buildMeanings(element); // parseMeanings(element)
  const readings = buildReadings(element);

  return [
    {
      meanings, // []
      readings, // []
    },
  ];
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
  return domQsa('.concept_light-tag', element)
    .filter((node) => node.innerText.includes('JLPT'))
    .map((node) => node.innerText) || null;
}


function parseKana(element) {
  const re = /(?!\b)\W+$/;
  const kana = domQs('.f-dropdown li:nth-of-type(2)', element); // FIXME: does selector work outside jQuery?
  const [kanaText] = (getText(kana).match(re) || []);
  return kanaText;
}

function parseKanji(element) {
  return getText(domQs('.text', element));
}

function buildMeanings(element) {
  const defs = [];
  const defNodes = domQsa('.meaning-wrapper', element)
    .filter((node) => node.innerText.includes('Wikipedia')); // might have to check siblings?

  defNodes.forEach((el) => {
    const tags = parseTags(el);

    // only numbered meanings have this class followed by meaning text
    const target = domQs('.meaning-definition-section_divider + span', el);
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
  const tags = domQs('.meaning-tags', element.previousElementSibling());
  const tagText = getText(tags);
  return tags === '' ? [] : tagText.split(', ');
}

function parseSentence(element) {
  const sentenceNodes = Array.from(domQs('', element).children);
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
  return domQsa('.supplemental_info .tag-tag', element).map(getText);
}

function getText(node) {
  return smartQuotes(node.innerText.trim());
}
