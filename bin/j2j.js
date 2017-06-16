#!/usr/bin/env/node
const {
  WORDLIST_FILE,
  QUIZ_FILE,
} = require('./constants');
const {
  log,
  writeFile,
  readWordList,
  getMatchingItems,
  addClipboardToVocab,
  quizSerializer,
} = require('./utils');

const argv = require('yargs')
  .option('s', { alias: 'save' })
  .option('c', { alias: 'check' })
  .option('q', { alias: 'quiz' })
  .argv;

async function runner() {
  const wordList = await readWordList(WORDLIST_FILE);

  if (argv.check) {
    const results = getMatchingItems(wordList, argv.check);
    if (results.length) {
      log.success(`Found ${results.length} results:`);
      log.pretty(results);
    } else {
      log.info(`Nothing found for ${argv.check}`);
    }
  }

  if (argv.quiz) {
    await writeFile(QUIZ_FILE, JSON.stringify(quizSerializer(wordList)));
  }

  if (argv.save) {
    const newList = await addClipboardToVocab(wordList);
    await writeFile(WORDLIST_FILE, JSON.stringify(newList));
  }
}

runner().catch(log.error);
