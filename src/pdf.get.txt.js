// @ts-check
const { stat, mkdir } = require('fs-extra');

async function createFolder(folder) {
  try {
    await stat(folder);
  } catch (e) {
    await mkdir(folder);
  }
}

module.exports = async function pdfGetTxt(file) {
  let folder = `${__dirname}/../data`;
  await createFolder(folder);

  if (file.indexOf('://') !== -1) {
    console.log('HTTP');
  }
};
