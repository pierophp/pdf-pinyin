// @ts-check
const { appendFile } = require('fs-extra');
const replaceall = require('replaceall');
const normalizeSearch = require('./normalize.search');
const removeSpaces = require('./remove.spaces');
const binaryIndexOf = require('./binary.index.of');

async function importPinyin(pdfResultParsed, line, indexOf, isFounded) {
  let index = indexOf;

  const result = [];
  let resultItem = -1;
  for (let lineIndex = 0; lineIndex < line.length; lineIndex++) {
    if (line.substr(lineIndex, 1) === '*') {
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
      result[resultItem].c.push(mapItem.char);
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
    result[resultItem].p.push(' ');
    result[resultItem].notFound = true;

    index++;
  }

  return result;
}

function fillBoldItalic(originalLine, returnLine) {
  let elementIndex = -1;
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

  return returnLine;
}

function debug(message) {
  if (process.env.DEBUG_LOG) {
    appendFile(`${__dirname}/../data/log.txt`, `${message}\n`).then();
  }
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
    let lineSearch = await normalizeSearch(line);

    let indexOf = -1;

    let whileContinue = true;

    let numberOfLoops = 0;
    let maxNumberOfLoops = 10000;

    const regexFootnote = /^\^\d+段/;
    const regexResult = line.match(regexFootnote);
    if (regexResult) {
      returnLine = returnLine.concat(
        await importPinyin(pdfResultParsed, regexResult[0], indexOf, false),
      );

      line = line.substr(regexResult[0].length);
      lineSearch = lineSearch.substr(regexResult[0].length);
    }
    let hasAsterisk = false;
    if (line.indexOf('*') >= 0) {
      hasAsterisk = true;
    }

    while (whileContinue) {
      numberOfLoops++;
      if (numberOfLoops > maxNumberOfLoops) {
        whileContinue = false;
      }

      const binaryIndexOfResult = binaryIndexOf(
        pdfResultParsed.ideograms,
        lineSearch,
        hasAsterisk,
      );

      if (binaryIndexOfResult.indexOf >= 0) {
        const foundLine = line.substr(0, binaryIndexOfResult.length);

        returnLine = returnLine.concat(
          await importPinyin(
            pdfResultParsed,
            foundLine,
            binaryIndexOfResult.indexOf,
            true,
          ),
        );

        line = line.substr(binaryIndexOfResult.length);
        if (!line) {
          whileContinue = false;
        }

        if (numberOfLoops > 1) {
          debug(
            `FOUND AT ${numberOfLoops} - ${line} ORIGINAL: ${originalLine}`,
          );
        }
      } else {
        returnLine = returnLine.concat(
          await importPinyin(pdfResultParsed, line.substr(0, 1), -1, false),
        );
        debug(`NOT FOUND AT ${numberOfLoops} - ${line}`);
        line = line.substr(0, line.length - 1);
        if (!line) {
          whileContinue = false;
        }
      }
    }

    if (hasBold || hasItalic) {
      returnLine = fillBoldItalic(originalLine, returnLine);
    }

    returnLines.push(returnLine);
  }

  return returnLines;
};
