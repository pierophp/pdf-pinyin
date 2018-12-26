// @ts-check
const pdfGetText = require('./src/pdf.get.txt');
const pdfResultParser = require('./src/pdf.result.parser.js');
const pinyinParser = require('./src/pinyin.parser');
const { stat, writeFile, readFile, remove } = require('fs-extra');

/**
 * @todo Improve Lock
 */
async function verifyLock(lockFile) {
  let loop = 0;
  try {
    while (1) {
      await stat(lockFile);

      console.log('Awaiting Lock');

      await new Promise(resolve => {
        setTimeout(resolve, 1000);
      });

      loop++;
    }
  } catch (e) {
    if (loop === 0) {
      return false;
    }

    return true;
  }
}

(async function init() {
  process.env.DEBUG_LOG = '0';

  const fullFilename = process.argv[2];
  const fullFilenameSplit = fullFilename.split('/');
  const filenameRelative = fullFilenameSplit[fullFilenameSplit.length - 1];

  const filename = `${__dirname}/data/${filenameRelative}`;
  const filenameToConvert = `${__dirname}/data/${process.argv[3]}`;
  const filenameToReturn = `${__dirname}/data/result.${process.argv[3]}.json`;
  const filenameTxt = `${filename}.txt`;
  const filenameParsed = `${filename}.parsed.json`;

  let resultString = '{}';

  await pdfGetText(fullFilename, filename, filenameTxt);

  try {
    await stat(filenameParsed);

    resultString = (await readFile(filenameParsed)).toString();
  } catch (e) {
    const lockFile = filenameParsed + '.lock';
    const lockResult = await verifyLock(lockFile);

    if (!lockResult) {
      await writeFile(lockFile, Date.now());

      const content = (await readFile(filenameTxt)).toString();

      resultString = JSON.stringify(await pdfResultParser(content), null, 2);
      await writeFile(filenameParsed, resultString);

      await remove(lockFile);
    } else {
      resultString = (await readFile(filenameParsed)).toString();
    }
  }

  const resultObject = JSON.parse(resultString);

  const contentToConvert = (await readFile(filenameToConvert)).toString();

  const lines = contentToConvert.split('\n');

  const returnLines = await pinyinParser(resultObject, lines);

  await writeFile(filenameToReturn, JSON.stringify(returnLines, null, 2));
})();
