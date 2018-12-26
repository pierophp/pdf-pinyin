// @ts-check
const getPdfParsedObject = require('./core/get.pdf.parsed.object');
const pinyinParser = require('./core/pinyin.parser');

module.exports = async function(fullFilename, lines) {
  const resultObject = await getPdfParsedObject(fullFilename, true);
  return await pinyinParser(resultObject, lines);
};
