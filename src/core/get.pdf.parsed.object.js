// @ts-check

const pdfToTxt = require('./pdf.to.txt');
const pdfTxtParser = require('./pdf.txt.parser');
const { stat, mkdir, writeFile, readFile, remove } = require('fs-extra');

async function createParentFolder(folder) {
  try {
    await stat(folder);
  } catch (e) {
    await mkdir(folder);
  }
}

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

module.exports = async function getPdfParsedObject(
  fullFilename,
  useLock,
  options,
) {
  const fullFilenameList = fullFilename.split('|||');
  const filenameRelativeList = [];
  for (const fullFilenameItem of fullFilenameList) {
    const fullFilenameSplit = fullFilenameItem.split('/');
    filenameRelativeList.push(fullFilenameSplit[fullFilenameSplit.length - 1]);
  }

  let baseDir = `${__dirname}/../../data`;
  if (options && options.dirname) {
    baseDir = options.dirname;
  }

  await createParentFolder(baseDir);

  const filenameRelative = filenameRelativeList.join('_');

  const filename = `${baseDir}/${filenameRelative}`;

  const filenameTxt = `${filename}.txt`;
  const filenameParsed = `${filename}.parsed.json`;

  let resultString = '{}';

  try {
    if (parseInt(process.env.NO_CACHE || '', 10)) {
      throw new Error('CACHE DISABLED');
    }

    await stat(filenameParsed);

    resultString = (await readFile(filenameParsed)).toString();
  } catch (e) {
    const lockFile = getLockFilename(filenameParsed);
    let lockResult = false;

    if (useLock) {
      lockResult = await verifyLock(lockFile);
    }

    if (!lockResult) {
      if (useLock) {
        await writeFile(lockFile, Date.now());
      }

      await pdfToTxt(fullFilename, filename, filenameTxt);

      const content = (await readFile(filenameTxt)).toString();

      resultString = JSON.stringify(
        await pdfTxtParser(content),
        null,
        process.env.DEBUG_LOG ? 2 : 0,
      );

      await writeFile(filenameParsed, resultString);

      if (useLock) {
        try {
          await remove(lockFile);
        } catch (e) {}
      }
    } else {
      resultString = (await readFile(filenameParsed)).toString();
    }
  }

  return JSON.parse(resultString);
};
