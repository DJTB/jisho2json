/* Unfortunately there are few unique classes and no ids, which makes targeting specific info rather unwieldy and brittle. If any of the classes or structure changes this will have to be adjusted manually. */

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

    // TODO: $(el).next('sentences') add as well linked to meaning

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

// returns array -> ['Noun', 'Suru Verb']
function parseTags(el) {
  var tags = $(el).prev('.meaning-tags').text();
  return (/Wiki|Other/gi.test(tags) || tags === '') ? [] : tags.split(', ').map(function(x) { return x.trim(); });
}

function parseSentences(el) {
  return $.map($(el).find('.sentence'), function(x) {
    return {
      "JA": $(x).find('.unlinked').text(),
      "EN": $(x).find('.english').text()
    };
  });
}

function parseInfo(el) {
  return $.map($(el).find('.supplemental_info .tag-tag'), function(x) {
    return $(x).text().trim();
  });
}

function buildJRE($entry) {
  var kana = parseKana($entry),
      ja = parseKanji($entry),
      en = parseMeanings($entry);

  var jre = {
    JA: {
      characters: ja,
      kana: kana || ja,
    },
    EN: en,
  };

  return jre;
}

function sendText(text) {
  chrome.extension.sendMessage({ text: text });
}

var $entries = $('.concept_light');

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

$entries.hover(hoverOn, hoverOff);

// TODO: append a stylish toastr top right that fades in showing what was copied, and fades out again.
// box says when jisho2json is ready too

$('body').on('click', '.concept_light', function() {
  var o = buildJRE($(this));
  console.log('Copied:\n', o);
  console.log('Tags: \n', JSON.stringify(o.EN));
  sendText(JSON.stringify(o));
});

console.log('jisho2json loaded');
