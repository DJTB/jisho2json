/* eslint-disable no-console, no-undef */
// TODO: remove jQuery dependency, modern Chrome's api is solid

const styles = `
   /* highlight clickable entries on hover */
  .concept_light {
    transition: all .5s ease-in
  }
  .concept_light:hover {
    transition: all .3s ease-out;
    box-shadow: 0 0 4px 0 cornflowerblue;
    cursor: pointer;
  }
  /* notification we will add to body */
  .toast {
    position: fixed;
    top: .5rem;
    right: .5rem;
    bottom: .5rem;
    left: .5rem;
    padding: .5rem;
    max-width: calc(100vw - 1rem);
    max-height: calc(100vh - 1rem);
    overflow: auto;
    font-size: 1.2rem;
    opacity: 0;
    margin: 0 .3rem;
    border: 4px solid gainsboro;
    border-radius: 5px;
    background-color: cornflowerblue;
    text-transform: capitalize;
    color: whitesmoke;
    cursor: pointer;
    z-index: 100; /* jisho overlay is at 95 already */
    /* <pre> formatting */
    white-space: pre-wrap;
    word-wrap: break-word;
    transition: opacity .35s ease-in;
    /* disable clicks */
    pointer-events: none;
  }
  .toast.--isVisible {
    transition: opacity .25s ease-out;
    pointer-events: initial;
    opacity: .95;
  }
`;

// blastoff!
ready(init);

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
  document.querySelector('body').addEventListener('click', ({ target }) => {
    const desiredTargetSelector = '.concept_light';
    const limit = document.querySelector('#primary');
    const entry = getParent(target, desiredTargetSelector, limit);

    if (entry) {
      const entryJSON = JSON.stringify(buildJRE($(entry)), null, 2);
      console.info('Copied:\n', (entryJSON));
      sendText(entryJSON); // copy to clipboard

      toaster.textContent = entryJSON; // eslint-disable-line no-param-reassign
      toaster.classList.add('--isVisible');
      clearTimeout(pendingFade);
      pendingFade = setTimeout(() => toaster.classList.remove('--isVisible'), 5000);
    }
  });
}

function getParent(el, selector, limit) {
  if (el.nodeType === 1 /* it's an element! */ && el.matches(selector)) {
    return el;
  }
  if (el === limit || !el.parentNode) {
    return false;
  }
  return el.parentNode ? getParent(el.parentNode, selector) : false;
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

    const toastEl = document.querySelector('.toast');
    return toastEl ? resolve(toastEl) : reject(new Error('Toast element not added to body'));
  });
}

function ready(callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

/* Unfortunately there are few unique classes and no ids, which makes targeting specific info rather unwieldy and brittle. If any of the classes or structure changes this will have to be adjusted manually. */

function parseKana(el) {
  return (el.find('.f-dropdown li:nth-of-type(2)').text().match(/(?!\b)\W+$/) || [])[0];
}

function parseKanji(el) {
  return el.find('.text').text().trim();
}

function parseMeanings(element) {
  const defs = [];
  const defNodes = element.find('.meaning-wrapper').not('.meaning-tags:contains("Wikipedia") + .meaning-wrapper');

  defNodes.each((i, el) => {
    const tags = parseTags(el);

    // only numbered meanings have this class followed by meaning text
    const text = $(el).find('.meaning-definition-section_divider + span').text().trim();

    if (text.length) {
      defs.push({
        meanings: text.split('; '),
        notes: parseInfo(el),
        tags,
        sentences: parseSentences(el),
      });
    }
  });

  return defs;
}

function parseTags(el) {
  const tags = $(el).prev('.meaning-tags').text();
  return tags === '' ? [] : tags.split(', ').map((x) => x.trim());
}

function parseSentences(el) {
  return $.map($(el).find('.sentence'), (x) => ({
    ja: $(x).find('.unlinked').text(),
    en: $(x).find('.english').text(),
  }));
}

function parseInfo(el) {
  return $.map($(el).find('.supplemental_info .tag-tag'), (x) => $(x).text().trim());
}

function buildJRE($entry) {
  const characters = parseKanji($entry);
  return {
    common: !!$entry.find('.concept_light-common').length,
    jlpt: $entry.find('.concept_light-tag:contains("JLPT")').text() || null,
    ja: {
      characters: parseKanji($entry),
      readings: parseKana($entry) || characters, // sometimes no kana if characters were hiragana to begin with
    },
    en: parseMeanings($entry),
  };
}

function sendText(text) {
  chrome.extension.sendMessage({ text }); // eslint-disable-line no-undef
}
