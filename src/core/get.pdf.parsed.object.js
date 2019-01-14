// @ts-check

const pdfToTxt = require('./pdf.to.txt');
const pdfTxtParser = require('./pdf.txt.parser');
const { stat, writeFile, readFile, remove } = require('fs-extra');

function getLockFilename(filename) {
  const now = new Date();
  const lockSuffix = `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${now
    .getDay()
    .toString()
    .padStart(2, '0')}`;

  return `${filename}${lockSuffix}.lock`;
}

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
  }

  return true;
}

module.exports = async function getPdfParsedObject(fullFilename, useLock) {
  const fullFilenameList = fullFilename.split('|||');
  const filenameRelativeList = [];
  for (const fullFilenameItem of fullFilenameList) {
    const fullFilenameSplit = fullFilenameItem.split('/');
    filenameRelativeList.push(fullFilenameSplit[fullFilenameSplit.length - 1]);
  }

  const filenameRelative = filenameRelativeList.join('_');

  const filename = `${__dirname}/../../data/${filenameRelative}`;

  const filenameTxt = `${filename}.txt`;
  const filenameParsed = `${filename}.parsed.json`;

  let resultString = '{}';

  try {
    await stat(filenameParsed);

    resultString = (await readFile(filenameParsed)).toString();
  } catch (e) {
    const lockFile = getLockFilename(filenameParsed);
    let lockResult = false;

    if (useLock) {
      lockResult = await verifyLock(lockFile);
    }

    if (!lockResult) {
      await writeFile(lockFile, Date.now());

      await pdfToTxt(fullFilename, filename, filenameTxt);

      const content = (await readFile(filenameTxt)).toString();

      resultString = JSON.stringify(await pdfTxtParser(content), null, 2);

      await writeFile(filenameParsed, resultString);

      await remove(lockFile);
    } else {
      resultString = (await readFile(filenameParsed)).toString();
    }
  }

  return JSON.parse(resultString);
};
