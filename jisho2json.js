
/* Unfortunately there are few unique classes and no ids, which makes targeting specific info rather unwieldy and brittle. Ff any of the classes or structure changes this will have to be adjusted manually. */

// FIXME: skip wikipedia entry, currently added to EN array
// FIXME: sentences smooshes together multiples if more than 1 example sentence
// TODO: example sentences tied to their parent definition

function parseKana(el) {
  return (el.find('.f-dropdown li:nth-of-type(2)').text().match(/(?!\b)\W+$/) || [])[0];
}

function parseKanji(el) {
  return el.find('.text').text().trim();
}

function parseMeanings(el) {
  var defs = [];
  var defNodes = el.find('.meaning-wrapper').not('.meaning-tags:contains("Wikipedia") + .meaning-wrapper');
  console.log('defNodes', defNodes)
  defNodes.each(function(i, el) {
    // only numbered meanings have this class followed by meaning text
    var text = $(el).find('.meaning-definition-section_divider + span').text().trim();

    if (text.length) {
      defs.push(text + parseInfo(el));
    }
  });

  return defs;
}

function parseTags(el) {
  return el.find('.meaning-tags:first').text().split(', ').map(function(x) { return x.trim(); });
}

function parseSentences(el) {
  var sentences = [];
  el.find('.sentence').each(function(i, s) {
    s = $(s);
    sentences.push({
      "JA": s.find('.unlinked').text(),
      "EN": s.find('.english').text()
    });
  })

  return sentences.length && sentences;
}

function parseInfo(el) {
  var text = [];
  $(el).find('.supplemental_info .sense-tag').each(function(i, el) {
    return text.push($(el).text());
  });
  return text.length ? ' (' + text.join(', ') + ')' : '';
}

function buildJRE($entry) {
  // FIXME: sentence should be part of EN/meanings
  var sentences = parseSentences($entry),
      kana = parseKana($entry),
      ja = parseKanji($entry);

  var jre = {
    Tags: parseTags($entry),
    JA: ja,
    Kana: kana || ja,
    EN: parseMeanings($entry)
  };

  if (!!sentences) Object.assign(jre, {Sentences: sentences});

  return jre;
}

function sendText(text) {
  chrome.extension.sendMessage({ text: text });
}

$('body').on('click', '.concept_light', function() {
  var o = buildJRE($(this));
  console.log('The following has been copied to the clipboard:\n', o);
  sendText(JSON.stringify(o));
});

console.log('jisho2json loaded');
