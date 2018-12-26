// @ts-check
const replaceall = require('replaceall');
const bluebird = require('bluebird');
const normalizeSearch = require('../helpers/normalize.search');
const removeSpaces = require('../helpers/remove.spaces');
const debug = require('../helpers/debug');
const binaryIndexOf = require('../helpers/binary.index.of');
const importPinyin = require('./pinyin/import.pinyin');
const fillBoldItalic = require('./pinyin/fill.bold.italic');

module.exports = async function pinyinParser(pdfResultParsed, lines = []) {
  const returnLines = await bluebird.map(
    lines,
    async (originalLine, i) => {
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

      let whileContinue = true;

      let numberOfLoops = 0;
      let maxNumberOfLoops = 10000;

      const regexFootnote = /^\^\d+段/;
      const regexResult = line.match(regexFootnote);
      if (regexResult) {
        returnLine = returnLine.concat(
          await importPinyin(pdfResultParsed, regexResult[0], -1, false),
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

        const binaryIndexOfResult = await binaryIndexOf(
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

          if (binaryIndexOfResult.partialSearchLevel > 1) {
            debug(
              `LEVEL ${
                binaryIndexOfResult.partialSearchLevel
              } LOOP ${numberOfLoops} - ${foundLine} ORIGINAL: ${originalLine}`,
            );
          }
        } else {
          returnLine = returnLine.concat(
            await importPinyin(pdfResultParsed, line.substr(0, 1), -1, false),
          );
          debug(
            `NOT FOUND LEVEL ${
              binaryIndexOfResult.partialSearchLevel
            } LOOP ${numberOfLoops} - ${line}`,
          );
          line = line.substr(0, line.length - 1);
          if (!line) {
            whileContinue = false;
          }
        }
      }

      if (hasBold || hasItalic) {
        returnLine = fillBoldItalic(originalLine, returnLine);
      }
      return returnLine;
    },
    {
      concurrency: 5,
    },
  );

  return returnLines;
};
