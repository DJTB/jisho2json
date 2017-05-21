#!/usr/bin/env/node

/* eslint-disable no-console, no-confusing-arrow, import/no-unresolved */
const Task = require('data.task');
const future = require('futurize').futurize(Task);
const { fromJS } = require('immutable');
const fs = require('fs');
const path = require('path');
const purdy = require('purdy');
const clip = require('copy-paste');
const { argv } = require('yargs');

const prettyLog = (values) => purdy(values, { depth: 4, indent: 2 });

const readFile = future(fs.readFile);
const writeFile = future(fs.writeFile);

console.log(process.cwd());
const FILE_DIR = './';
const WORDLIST_FILE = path.join(FILE_DIR, 'wordList.json');
const QUIZ_FILE = addFilenameSuffix(WORDLIST_FILE, '-quiz');

/**
 * Read current vocablist
 */
const readWordlist =
  readFile(WORDLIST_FILE, 'utf8')
    .map(contents => JSON.parse(contents))

/**
 * Obtain system clipboard content if it is valid JSON
 */
const getClipboardJSON = new Task((reject, resolve) => {
  const clipped = clip.paste();
  try {
    resolve(JSON.parse(clipped));
  } catch (err) {
    console.log('Clipboard contained: ');
    prettyLog(clipped);
    reject(err);
  }
});

/**
 * Add vocab item to wordlist if not already present
 * @param {Array} vocabList
 * @param {Object} newItem [description]
 * @return {Set} set of vocabList
 */
const addNewVocab = (vocabList, newItem) => new Task((reject, resolve) => {
  const vocabSet = fromJS(vocabList);
  const toAdd = fromJS(newItem);
  if (vocabSet.includes(toAdd)) {
    reject(new Error(`Entry ${toAdd.getIn(['ja', 'characters'])} already exists in ${WORDLIST_FILE}!`));
  } else {
    resolve(vocabSet.push(newItem));
  }
});

const logAddVocabSuccess = (list, item) => {
  console.log('Added new vocab: ');
  prettyLog(item);
  console.log('Vocab now contains', list.size, 'entries.');
};

// blastoff
readWordlist.fork(
  console.error,
  ({ vocab: vocabList }) => {
    getClipboardJSON.fork(
      err => {
        console.warn('Valid JSON not present in clipboard!');
        console.error(err);
      },
      (vocabItem) => addNewVocab(vocabList, vocabItem).fork(
        console.error,
        (newVocabList) => {
          logAddVocabSuccess(newVocabList, vocabItem);
          if (argv._.length < 1) {
            console.log('Clipboard contains:\n\n', clip.paste(), '\n');
            const msg = 'Did you want to do something with it? Try passing \'quiz\' or \'save\' as a CLI arg';
            console.log(`${'-'.repeat(msg.length + 2)}\n ${msg} \n${'-'.repeat(msg.length + 2)}`);
          }
          if (argsInclude('quiz')) {
            writeFile(QUIZ_FILE, JSON.stringify(quizFormat(newVocabList.toJS())))
            .fork(console.error, () => console.log(`Wrote new quiz list: ${WORDLIST_FILE}`));
          }
          if (argsInclude('save')) {
            writeFile(WORDLIST_FILE, JSON.stringify({ vocab: newVocabList.toJS() }))
            .fork(console.error, () => console.log(`Wrote new wordlist: ${WORDLIST_FILE}`));
          }
        }));
  });


/**
 * Adds a suffix before file extension
 * @param {String} filename 'someFile.json'
 * @param {String} suffix '-backup'
 * @return {String} 'someFile-backup.json'
 */
function addFilenameSuffix(filename, suffix) {
  return filename.replace(/(\.\w+)$/, ($ext) => `${suffix}${$ext}`);
}


/**
 * Check CLI arguments for arg
 * @param  {String} arg
 * @return {Boolean}
 */
function argsInclude(arg) { return argv._.includes(arg); }


/**
 * Format vocab shape to match KaniWani expected shape
 * @param  {Array} vocablist
 * @return {Array} Formatted vocablist
 */
function quizFormat(vocablist) {
  // FIXME: doesn't work with new wordList format, need to edit!
  return vocablist;
  // return vocablist.map((v) => ({
  //   characters: [v.JA],
  //   readings: [v.Kana],
  //   meaning: v.EN[0].split(';').join(','),
  // }));
}
