// @ts-check

const pdfPinyin = require('./src/pdf.pinyin');
const { readFile, writeFile } = require('fs-extra');

(async function init() {
  process.env.DEBUG_LOG = '1';
  const filenameToConvert = `${__dirname}/data/${process.argv[3]}`;
  const filenameToReturn = `${__dirname}/data/result.${process.argv[3]}.json`;

  const contentToConvert = (await readFile(filenameToConvert)).toString();

  const lines = contentToConvert.split('\n');

  const returnLines = await pdfPinyin(process.argv[2], lines);

  await writeFile(
    filenameToReturn,
    JSON.stringify(returnLines, null, process.env.DEBUG_LOG ? 2 : 0),
  );
})();
