// @ts-check

const pinyinParser = require('./core/pinyin.parser');
const getPdfParsedObject = require('./core/get.pdf.parsed.object');

module.exports = async function(fullFilename, lines) {
  const resultObject = await getPdfParsedObject(fullFilename, true);
  return await pinyinParser(resultObject, lines);
};
