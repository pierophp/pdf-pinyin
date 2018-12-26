// @ts-check
const pdfToText = require('./core/pdf.to.txt');
const pdfTxtParser = require('./core/pdf.txt.parser');
const pinyinParser = require('./core/pinyin.parser');
const { stat, writeFile, readFile, remove } = require('fs-extra');

/*
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

module.exports = async function(fullFilename, lines) {
  const fullFilenameSplit = fullFilename.split('/');
  const filenameRelative = fullFilenameSplit[fullFilenameSplit.length - 1];

  const filename = `${__dirname}/../data/${filenameRelative}`;

  const filenameTxt = `${filename}.txt`;
  const filenameParsed = `${filename}.parsed.json`;

  let resultString = '{}';

  await pdfToText(fullFilename, filename, filenameTxt);

  try {
    await stat(filenameParsed);

    resultString = (await readFile(filenameParsed)).toString();
  } catch (e) {
    const lockFile = filenameParsed + '.lock';
    const lockResult = await verifyLock(lockFile);

    if (!lockResult) {
      await writeFile(lockFile, Date.now());

      const content = (await readFile(filenameTxt)).toString();

      resultString = JSON.stringify(await pdfTxtParser(content), null, 2);
      await writeFile(filenameParsed, resultString);

      await remove(lockFile);
    } else {
      resultString = (await readFile(filenameParsed)).toString();
    }
  }

  const resultObject = JSON.parse(resultString);

  return await pinyinParser(resultObject, lines);
};
