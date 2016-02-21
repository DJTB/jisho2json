/* Unfortunately there are few unique classes and no ids, which makes targeting specific info rather unwieldy and brittle. If any of the classes or structure changes this will have to be adjusted manually. */

var $entries = $('.concept_light');
$entries.hover(hoverOn, hoverOff);


$('body').on('click', '.concept_light', function() {
  var obj = buildJRE($(this));
  sendText(obj); // obj must be JSON
  console.log('Copied:\n', (obj));
  // TODO: append a stylish toastr top right that fades in showing what was copied, and fades out again.
  // TODO: box says when jisho2json is ready too
});

console.log('jisho2json loaded');

function parseKana(el) {
  return (el.find('.f-dropdown li:nth-of-type(2)').text().match(/(?!\b)\W+$/) || [])[0];
}

function parseKanji(el) {
  return el.find('.text').text().trim();
}

function parseMeanings(el) {
  var defs = [];
  var defNodes = el.find('.meaning-wrapper').not('.meaning-tags:contains("Wikipedia") + .meaning-wrapper');

  defNodes.each(function(i, el) {
    var tags = parseTags(el);

    // only numbered meanings have this class followed by meaning text
    var text = $(el).find('.meaning-definition-section_divider + span').text().trim();

    if (text.length) {
      defs.push({
        meanings: text.split('; '),
        notes: parseInfo(el),
        tags: tags,
        sentences: parseSentences(el),
      });
    }
  });

  return defs;
}

function parseTags(el) {
  var tags = $(el).prev('.meaning-tags').text();
  return tags === '' ? [] : tags.split(', ').map(function(x) { return x.trim(); });
}

function parseSentences(el) {
  return $.map($(el).find('.sentence'), function(x) {
    return {
      "ja": $(x).find('.unlinked').text(),
      "en": $(x).find('.english').text()
    };
  });
}

function parseInfo(el) {
  return $.map($(el).find('.supplemental_info .tag-tag'), function(x) {
    return $(x).text().trim();
  });
}

function buildJRE($entry) {
  return JSON.stringify({
    common: !!$entry.find('.concept_light-common').length,
    jlpt: $entry.find('.concept_light-tag:contains("JLPT")').text() || null,
    ja: {
      characters: parseKanji($entry),
      readings: parseKana($entry) || ja, // sometimes no kana if characters were hiragana to begin with
    },
    en: parseMeanings($entry),
  });
}

function sendText(text) {
  chrome.extension.sendMessage({ text: text });
}

function hoverOn() {
  $(this).css({
    boxShadow: '0 0 4px 0 tomato',
    cursor: 'pointer'
  });
}

function hoverOff() {
 $(this).css({
    boxShadow: 'none'
  });
}
