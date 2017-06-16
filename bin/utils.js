/* eslint-disable no-console */
const fs = require('fs');
const clip = require('copy-paste');
const chalk = require('chalk');
const purdy = require('purdy');
const { promisify } = require('util');
const { flowRight, partialRight } = require('lodash');
const { validate } = require('jsonschema');
const { WORDLIST_FILE, VOCAB_ENTRY_SCHEMA } = require('./constants');

const log = {
  info: flowRight(console.log, chalk.yellow),
  error: flowRight(console.log, chalk.bold.red),
  success: flowRight(console.log, chalk.bold.green),
  pretty: partialRight(purdy, { depth: 4, indent: 2 }),
};

const traceAndThrow = (errorInstance, message) => {
  console.error(errorInstance); // eslint-disable-line no-console
  throw Error(message);
};

async function readFile(filePath) {
  return promisify(fs.readFile)(filePath, 'utf8');
}

async function writeFile(filePath, data) {
  await promisify(fs.writeFile)(filePath, data);
  log.info(`${filePath} written to disk`);
}

async function readWordList(file) {
  try {
    const content = await readFile(file);
    return JSON.parse(content).entries;
  } catch (err) {
    return traceAndThrow(err, 'Unable to parse JSON from wordList file.');
  }
}

function getClipboardJSON() {
  try {
    const clipped = JSON.parse(clip.paste());
    const { errors } = validate(clipped, VOCAB_ENTRY_SCHEMA);
    if (errors.length) {
      throw Error(errors[0]);
    }
    return clipped;
  } catch (err) {
    return traceAndThrow(err, 'Invalid data pasted from clipboard.');
  }
}

const getMatchingItems = (list, str) =>
  list.filter(({ ja }) => [ja.readings, ja.characters].includes(str));

async function addNewVocab(vocabList, newItem) {
  const chars = newItem.ja.characters;
  const hasExactEntry = vocabList.includes(newItem);
  const hasSimilarItems = getMatchingItems(vocabList, chars).length > 0;

  if (hasExactEntry || hasSimilarItems) {
    throw Error(`An entry with ${chars} already exists in ${WORDLIST_FILE}.`);
  }

  log.success('Added new vocab: ');
  log.pretty(newItem);
  log.success('Vocab now contains', vocabList.length, 'entries.');
  return vocabList.concat(newItem);
}

async function addClipboardToVocab(vocabList) {
  const entries = await addNewVocab(vocabList, getClipboardJSON());
  return { entries };
}

function quizSerializer(vocabList) {
  // FIXME: doesn't work with new wordList format, need to edit!
  return vocabList;
  // return vocabList.map((v) => ({
  //   characters: [v.JA],
  //   readings: [v.Kana],
  //   meaning: v.EN[0].split(';').join(','),
  // }));
}

module.exports = {
  log,
  writeFile,
  readWordList,
  getMatchingItems,
  addClipboardToVocab,
  quizSerializer,
};
