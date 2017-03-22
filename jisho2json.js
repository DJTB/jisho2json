/* eslint-disable no-console, no-undef */

/* Unfortunately there are few unique classes and no ids, which makes targeting specific info rather unwieldy and brittle. If any of the classes or structure changes this will have to be adjusted manually. */

// blastoff!
ready(init);

function init() {
  console.info('jisho2json loaded');

  renderToast()
    .then((toast) => {
      let pendingFade;
      // allow user to dismiss toast
      toast.addEventListener('click', () => fadeOut(toast));

      // highlight clickable entries
      $('.concept_light').hover(addHighlight, removeHighlight);

      // parse and copy entry to clipboard
      $('body').on('click', '.concept_light', function onEntryClick() {
        const obj = buildJRE($(this));
        sendText(obj); // stringified JSON
        console.info('Copied:\n', (obj));
        toast.textContent = obj; // eslint-disable-line no-param-reassign

        // animate and hold onto fadeout timer reference to allow reset
        fadeIn(toast, 0.95);
        clearTimeout(pendingFade);
        pendingFade = setTimeout(() => fadeOut(toast), 5000);
      });
    })
    .catch(console.error);
}

function renderToast() {
  return new Promise((resolve, reject) => {
    const toast = document.createElement('pre');
    Object.assign(toast, {
      id: 'toast',
      textContent: 'jisho2json loaded',
    });
    Object.assign(toast.style, {
      position: 'fixed',
      top: '.5rem',
      right: '.5rem',
      padding: '2rem',
      maxWidth: 'calc(100vw - 1rem)',
      fontSize: '1.2rem',
      opacity: '0',
      margin: '0 .3rem',
      borderRadius: '5px',
      backgroundColor: 'cornflowerblue',
      textTransform: 'capitalize',
      color: 'whitesmoke',
      cursor: 'pointer',
      zIndex: '100', // jisho overlay is 95 >_<
      // <pre> formatting
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
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

function fadeIn(el = {}, targetOpacity = 1, speed = 400) {
  let opacity = +window.getComputedStyle(el).opacity;
  let time = +new Date();
  if (opacity >= targetOpacity) return;

  function tick() {
    opacity += ((new Date() - time) / speed);
    time = +new Date();
    el.style.opacity = opacity; // eslint-disable-line no-param-reassign

    if (opacity < targetOpacity) window.requestAnimationFrame(tick);
  }

  tick();
}

function fadeOut(el = {}, targetOpacity = 0, speed = 400) {
  let opacity = +el.style.opacity;
  let time = +new Date();
  if (opacity <= targetOpacity) return;

  function tick() {
    opacity -= ((new Date() - time) / speed);
    time = +new Date();
    el.style.opacity = opacity; // eslint-disable-line no-param-reassign

    if (opacity > targetOpacity) window.requestAnimationFrame(tick);
  }

  tick();
}

function addHighlight() {
  $(this).css({
    boxShadow: '0 0 4px 0 cornflowerblue',
    cursor: 'pointer',
  });
}

function removeHighlight() {
  $(this).css({
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
