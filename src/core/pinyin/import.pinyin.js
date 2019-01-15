const isChinese = require('../../helpers/is.chinese');
const pinyinConverter = require('pinyin');

module.exports = async function importPinyin(
  pdfResultParsed,
  line,
  indexOf,
  isFounded,
) {
  let index = indexOf;

  const result = [];
  let resultItem = -1;
  for (let lineIndex = 0; lineIndex < line.length; lineIndex++) {
    if (line[lineIndex] === '*') {
      resultItem++;

      if (!result[resultItem]) {
        result[resultItem] = {};
        result[resultItem].c = [];
        result[resultItem].p = [];
      }

      result[resultItem].c.push(line[lineIndex]);
      result[resultItem].p.push(' ');
      result[resultItem].notFound = true;

      continue;
    }

    if (isFounded) {
      const mapItem = pdfResultParsed.map[index];

      if (mapItem.beginWord) {
        resultItem++;
      }

      if (resultItem < 0) {
        resultItem = 0;
      }

      if (!result[resultItem]) {
        result[resultItem] = {};
        result[resultItem].c = [];
        result[resultItem].p = [];
      }
      result[resultItem].c.push(line[lineIndex]);
      result[resultItem].p.push(mapItem.pinyin ? mapItem.pinyin : ' ');

      index++;

      continue;
    }

    resultItem++;

    if (!result[resultItem]) {
      result[resultItem] = {};
      result[resultItem].c = [];
      result[resultItem].p = [];
    }

    result[resultItem].c.push(line[lineIndex]);

    const isChineseVerification = isChinese(line[lineIndex], true);

    if (
      isChineseVerification.isChinese &&
      isChineseVerification.type === 'ideograms'
    ) {
      result[resultItem].p.push(pinyinConverter(line[lineIndex]).join(''));
    } else {
      result[resultItem].p.push(' ');
    }

    result[resultItem].notFound = true;

    index++;
  }

  return result;
};
