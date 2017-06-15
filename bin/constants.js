const path = require('path');
const os = require('os');

const addFilenameSuffix = (filename, suffix) =>
  filename.replace(/(\.\w+)$/, ($ext) => `${suffix}${$ext}`);

const WORDLIST_FILE = path.join(os.homedir(), 'Documents', 'jisho2json', 'wordList.json');
const QUIZ_FILE = addFilenameSuffix(WORDLIST_FILE, '-quiz');

const VOCAB_ENTRY_SCHEMA = {
  type: 'object',
  properties: {
    common: { type: ['string', 'boolean'] },
    jlpt: { type: ['string', 'null'] },
    ja: { type: 'object',
      properties: {
        characters: { type: 'string' },
        readings: { type: 'string' },
      },
      required: ['characters', 'readings'],
    },
    en: {
      type: 'array',
      items: { type: 'object',
        properties: {
          meanings: { type: 'array', items: { type: 'string' } },
          notes: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
          sentences: { type: 'array',
            items: { type: 'object',
              properties: {
                ja: { type: 'string' },
                en: { type: 'string' },
              },
              required: ['ja', 'en'],
            } },
        },
        required: ['meanings', 'notes', 'tags', 'sentences'],
      },
    },
    required: ['common', 'jlpt', 'en', 'ja'],
  },
};

module.exports = {
  WORDLIST_FILE,
  QUIZ_FILE,
  VOCAB_ENTRY_SCHEMA,
};
