// @ts-check
const removeSpaces = require('./remove.spaces');

async function importPinyin(pdfResultParsed, line, indexOf) {
  let index = indexOf;

  const result = [];
  let resultItem = -1;
  for (let lineIndex = 0; lineIndex < line.length; lineIndex++) {
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
    result[resultItem].c.push(mapItem.char);
    result[resultItem].p.push(mapItem.pinyin ? mapItem.pinyin : '');

    index++;
  }

  return result;
}

module.exports = async function pinyinParser(pdfResultParsed, lines = []) {
  const returnLines = [];
  for (let line of lines) {
    let returnLine = [];

    line = removeSpaces(line);

    let indexOf = -1;

    let whileContinue = true;
    let notFoundYet = '';

    let numberOfLoops = 0;
    let maxNumberOfLoops = 5000;

    while (whileContinue) {
      numberOfLoops++;
      if (numberOfLoops > maxNumberOfLoops) {
        whileContinue = false;
      }

      indexOf = pdfResultParsed.ideograms.indexOf(line);

      if (indexOf >= 0) {
        const pinyinResult = await importPinyin(pdfResultParsed, line, indexOf);

        returnLine = returnLine.concat(pinyinResult);

        indexOf = -1;

        if (notFoundYet) {
          line = notFoundYet.trim();
          notFoundYet = '';
        } else {
          whileContinue = false;
        }
      } else {
        notFoundYet = line.substr(-1) + notFoundYet;
        line = line.substr(0, line.length - 1);

        if (!line) {
          whileContinue = false;
        }
      }
    }

    returnLines.push(returnLine);
  }

  return returnLines;
};
