
/* Unfortunately there are few unique classes and no ids, which makes targeting specific info rather unwieldy and brittle. Ff any of the classes or structure changes this will have to be adjusted manually. */

// FIXME: skip wikipedia entry, currently added to EN array
// FIXME: sentences smooshes together multiples if more than 1 example sentence
// TODO: example sentences tied to their parent definition

console.log('jisho2json ready');

function parseKana(el) {
  return (el.find('.f-dropdown li:nth-of-type(2)').text().match(/(?!\b)\W+$/) || [])[0];
}

function parseKanji(el) {
  return el.find('.text').text().trim();
}

function parseMeanings(el) {
  var defs = [];
  var defNodes = el.find('.meaning-wrapper');

  defNodes.each(function(_, el) {
    // only numbered meanings have this class followed by meaning text
    var text = $(el).find('.meaning-definition-section_divider + span').text().trim();

    if (text.length) defs.push(text + parseInfo(el));
  });

  return defs.length < 2 ? defs[0] : defs;
}

function parseTags(el) {
  var tags = el.find('.meaning-tags:first').text().split(', ');
  return tags.length < 2 ? tags[0] : tags;
}

// FIXME: currently grabs parts of ALL example sentences. This should be called for each meaning, to see if the meaning has a sentence, and the sentence should be added to that specific meaning.
function parseSentence(el) {
  var s = el.find('.sentence');
  var ja = s.find('.unlinked').text();
  var en = s.find('.english').text();

  return ja.length && {JA: ja, EN: en};
}

function parseInfo(el) {
  var text = $(el).find('.supplemental_info .sense-tag').text();
  return text.length ? ' (' + text + ')' : '';
}

function buildJRE($entry) {
  // FIXME: sentence should be part of EN/meanings
  var sentence = parseSentence($entry),
      kana = parseKana($entry),
      ja = parseKanji($entry);

  var jre = {
    Tags: parseTags($entry),
    JA: ja,
    Kana: kana || ja,
    EN: parseMeanings($entry)
  };

  if (!!sentence) Object.assign(jre, {Sentence: sentence});

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
