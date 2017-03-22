/* eslint-disable no-console, no-undef */

/* Unfortunately there are few unique classes and no ids, which makes targeting specific info rather unwieldy and brittle. If any of the classes or structure changes this will have to be adjusted manually. */

// blastoff!
ready(init);

function init() {
  console.log('jisho2json loaded');

  renderToast()
    .then((toast) => {
      fadeIn(toast);
      setTimeout(() => fadeOut(toast), 2000);

      // highlight clickable entries on hover
      document.querySelectorAll('.concept_light').forEach((el) => {
        el.addEventListener('mouseenter', addHighlight);
        el.addEventListener('mouseout', removeHighlight);
      });

      // parse and copy entry to clipboard
      $('body').on('click', '.concept_light', () => {
        const obj = buildJRE($(this));
        sendText(obj); // obj must be JSON
        toast.textContent = JSON.stringify(obj); // eslint-disable-line no-param-reassign
        fadeIn(toast);
        setTimeout(() => fadeOut(toast), 2500);
        console.info('Copied:\n', (obj));
      });
    })
    .catch(console.error);
}

function renderToast() {
  return new Promise((resolve, reject) => {
    const toast = document.createElement('div');
    Object.assign(toast, {
      id: 'toast',
      textContent: 'jisho2json loaded',
    });
    Object.assign(toast.style, {
      position: 'absolute',
      top: '0px',
      right: '0px',
      padding: '2rem',
      opacity: '0',
      margin: '0 .3rem',
      borderRadius: '5px',
      backgroundColor: 'cornflowerblue',
      textTransform: 'capitalize',
      color: 'whitesmoke',
      zIndex: '100', // jisho overlay is 95 >_<
    });
    document.body.append(toast);
    const toastEl = document.getElementById('toast');
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

function fadeIn(el = {}, speed = 400) {
  let opacity = +window.getComputedStyle(el).opacity;
  let time = +new Date();
  if (opacity !== 0) return;

  function tick() {
    opacity += ((new Date() - time) / speed);
    time = +new Date();
    el.style.opacity = opacity; // eslint-disable-line no-param-reassign

    if (opacity < 1) window.requestAnimationFrame(tick);
  }

  tick();
}

function fadeOut(el = {}, speed = 400) {
  let opacity = +el.style.opacity;
  let time = +new Date();
  if (opacity <= 0) return;

  function tick() {
    opacity -= ((new Date() - time) / speed);
    time = +new Date();
    el.style.opacity = opacity; // eslint-disable-line no-param-reassign

    if (opacity > 0) window.requestAnimationFrame(tick);
  }

  tick();
}

function addHighlight({ target } = {}) {
  // contains is a prototype method on a domTokenList, otherwise this would be Array.from(classList).includes(className)
  Object.assign(target.style, {
    boxShadow: '0 0 4px 0 tomato',
    cursor: 'pointer',
  });
}

function removeHighlight({ target } = {}) {
  // contains is a prototype method on a domTokenList, otherwise this would be Array.from(classList).includes(className)
  Object.assign(target.style, {
    boxShadow: 'none',
  });
}

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
  return JSON.stringify({
    common: !!$entry.find('.concept_light-common').length,
    jlpt: $entry.find('.concept_light-tag:contains("JLPT")').text() || null,
    ja: {
      characters: parseKanji($entry),
      readings: parseKana($entry) || characters, // sometimes no kana if characters were hiragana to begin with
    },
    en: parseMeanings($entry),
  });
}

function sendText(text) {
  chrome.extension.sendMessage({ text }); // eslint-disable-line no-undef
}
