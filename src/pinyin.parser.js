// @ts-check
const removeSpaces = require('./remove.spaces');
const replaceall = require('replaceall');

async function importPinyin(pdfResultParsed, line, indexOf, isFounded) {
  let index = indexOf;

  const result = [];
  let resultItem = -1;
  for (let lineIndex = 0; lineIndex < line.length; lineIndex++) {
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
      result[resultItem].c.push(mapItem.char);
      result[resultItem].p.push(mapItem.pinyin ? mapItem.pinyin : '');
    } else {
      resultItem++;

      if (resultItem < 0) {
        resultItem = 0;
      }

      if (!result[resultItem]) {
        result[resultItem] = {};
        result[resultItem].c = [];
        result[resultItem].p = [];
      }

      result[resultItem].c.push(line[lineIndex]);
      result[resultItem].p.push('');
      result[resultItem].notFound = true;
    }

    index++;
  }
  return result;
}

module.exports = async function pinyinParser(pdfResultParsed, lines = []) {
  const returnLines = [];
  for (const originalLine of lines) {
    let returnLine = [];
    let line = originalLine;

    let hasBold = false;
    if (line.indexOf('<b>') !== -1) {
      hasBold = true;
      line = replaceall('<b>', '', line);
      line = replaceall('</b>', '', line);
    }

    let hasItalic = false;
    if (line.indexOf('<i>') !== -1) {
      hasItalic = true;
      line = replaceall('<i>', '', line);
      line = replaceall('</i>', '', line);
    }

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
        returnLine = returnLine.concat(
          await importPinyin(pdfResultParsed, line, indexOf, true),
        );

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
          if (notFoundYet) {
            returnLine = returnLine.concat(
              await importPinyin(
                pdfResultParsed,
                notFoundYet.substr(0, 1),
                indexOf,
                false,
              ),
            );

            line = notFoundYet.substr(1);
            notFoundYet = '';
          } else {
            whileContinue = false;
          }
        }
      }
    }

    let elementIndex = -1;

    if (hasBold || hasItalic) {
      let isBold = false;
      let isItalic = false;
      for (const item of returnLine) {
        for (const character of item.c) {
          elementIndex++;

          if (originalLine[elementIndex] === character) {
            if (isBold) {
              item.isBold = true;
            }

            if (isItalic) {
              item.isItalic = true;
            }
            continue;
          }

          if (originalLine.substr(elementIndex, 3) === '<b>') {
            isBold = true;
            item.isBold = true;
            elementIndex += 3;
          }

          if (originalLine.substr(elementIndex, 4) === '</b>') {
            isBold = false;
            elementIndex += 4;
          }

          if (originalLine.substr(elementIndex, 3) === '<i>') {
            isItalic = true;
            item.isItalic = true;
            elementIndex += 3;
          }

          if (originalLine.substr(elementIndex, 4) === '</i>') {
            isItalic = false;
            elementIndex += 4;
          }
        }
      }
    }

    returnLines.push(returnLine);
  }

  return returnLines;
};
