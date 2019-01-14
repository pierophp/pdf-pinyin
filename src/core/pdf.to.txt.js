// @ts-check
const { stat, mkdir, readFile, writeFile, remove } = require('fs-extra');
const axios = require('axios').default;

const { exec } = require('child-process-async');

async function createParentFolder() {
  const folder = `${__dirname}/../../data`;
  try {
    await stat(folder);
  } catch (e) {
    await mkdir(folder);
  }
}

async function downloadFile(fullFilename, filename) {
  try {
    await stat(filename);
  } catch (e) {
    if (fullFilename.indexOf('://') !== -1) {
      const result = await axios.request({
        responseType: 'arraybuffer',
        url: fullFilename,
        method: 'get',
      });

      await writeFile(filename, result.data);
    }
  }
}

async function extractFile(filename, filenameTxt) {
  try {
    await stat(filenameTxt);
  } catch (e) {
    const child = await exec(`pdftotext -raw ${filename} ${filenameTxt}`, {});
    await child;
  }
}

module.exports = async function pdfToTxt(fullFilename, filename, filenameTxt) {
  await createParentFolder();

  const fullFilenameList = fullFilename.split('|||');
  let i = 0;
  let contentPdf = ``;

  for (const fullFilenameItem of fullFilenameList) {
    const filenameItem = `${filename}_${i}`;
    const filenameTxtItem = `${filenameTxt}_${i}`;

    await downloadFile(fullFilenameItem, filenameItem);
    await extractFile(filenameItem, filenameTxtItem);

    contentPdf += (await readFile(filenameTxtItem)).toString();

    await remove(filenameItem);
    await remove(filenameTxtItem);
    i++;
  }

  await writeFile(filenameTxt, contentPdf);
};
