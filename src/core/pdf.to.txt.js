// @ts-check
const { stat, mkdir, writeFile } = require('fs-extra');
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
  await downloadFile(fullFilename, filename);
  await extractFile(filename, filenameTxt);
};
