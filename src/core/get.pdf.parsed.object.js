// @ts-check

const pdfToTxt = require('./pdf.to.txt');
const pdfTxtParser = require('./pdf.txt.parser');
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
    const lockFile = filenameParsed + '.lock';
    let lockResult = false;

    if (useLock) {
      lockResult = await verifyLock(lockFile);
    }

    if (!lockResult) {
      await pdfToTxt(fullFilename, filename, filenameTxt);

      await writeFile(lockFile, Date.now());

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
