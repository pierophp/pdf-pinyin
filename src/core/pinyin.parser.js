// @ts-check
const bluebird = require('bluebird');
const striptags = require('striptags');
const normalizeSearch = require('../helpers/normalize.search');
const removeSpaces = require('../helpers/remove.spaces');
const debug = require('../helpers/debug');
const binaryIndexOf = require('../helpers/binary.index.of');
const importPinyin = require('./pinyin/import.pinyin');
const fillBoldItalic = require('./pinyin/fill.bold.italic');

function generateHtml(lines) {
  let html = '';
  for (const line of lines) {
    for (const block of line) {
      if (block.tagsStart) {
        html += block.tagsStart;
      }
      html += '<ruby>';
      html += '<rb>';
      html += block.c.join('');
      html += '</rb>';
      html += '<rt>';
      html += block.p.join('');
      html += '</rt>';
      html += '</ruby>';

      if (block.tagsEnd) {
        html += block.tagsEnd;
      }
    }

    html += '\n';
  }

  return html;
}

function verifyHasBoldOrItalic(text) {
  if (text.indexOf('<b>') !== -1) {
    return true;
  }

  if (text.indexOf('<i>') !== -1) {
    return true;
  }

  return false;
}

function backHtmlTags(returnLine, lineWithTags) {
  let lineWithTagsCounter = 0;

  let returnLineCounter = 0;
  let returnLineIdeogramCounter = 0;
  let end = false;
  let newReturnLineCounter = 0;
  let newReturnLine = [];

  while (lineWithTagsCounter < lineWithTags.length) {
    if (returnLineCounter >= returnLine.length) {
      end = true;
      returnLineCounter = returnLine.length - 1;
      newReturnLineCounter--;
    }

    if (!newReturnLine[newReturnLineCounter]) {
      newReturnLine[newReturnLineCounter] = {
        c: [],
        p: [],
      };
    }

    const returnLineIdeogram =
      returnLine[returnLineCounter].c[returnLineIdeogramCounter];

    const returnLinePinyin =
      returnLine[returnLineCounter].p[returnLineIdeogramCounter];

    if (returnLineIdeogram === lineWithTags[lineWithTagsCounter]) {
      newReturnLine[newReturnLineCounter].c.push(returnLineIdeogram);
      newReturnLine[newReturnLineCounter].p.push(returnLinePinyin);

      returnLineIdeogramCounter++;
      if (
        returnLine[returnLineCounter].c.length <= returnLineIdeogramCounter &&
        !end
      ) {
        returnLineIdeogramCounter = 0;
        returnLineCounter++;
        newReturnLineCounter++;
      }

      lineWithTagsCounter++;
      continue;
    }

    let tagName = 'tagsStart';
    if (end) {
      tagName = 'tagsEnd';
    }

    if (
      tagName === 'tagsStart' &&
      newReturnLine[newReturnLineCounter].c.length
    ) {
      newReturnLineCounter++;
    }

    if (!newReturnLine[newReturnLineCounter]) {
      newReturnLine[newReturnLineCounter] = {
        c: [],
        p: [],
      };
    }

    if (!newReturnLine[newReturnLineCounter][tagName]) {
      newReturnLine[newReturnLineCounter][tagName] = '';
    }

    newReturnLine[newReturnLineCounter][tagName] +=
      lineWithTags[lineWithTagsCounter];

    lineWithTagsCounter++;
  }

  return newReturnLine;
}

module.exports = async function pinyinParser(pdfResultParsed, lines = []) {
  const maxNumberOfLoops = 3000;

  const returnLines = await bluebird.map(
    lines,
    async (originalLine, i) => {
      let returnLine = [];
      let line = originalLine;

      const hasBoldOrItalic = verifyHasBoldOrItalic(line);

      const lineWithTags = line;
      const lineWithoutTags = striptags(line);

      line = removeSpaces(lineWithoutTags);

      let lineSearch = await normalizeSearch(line);

      let whileContinue = true;

      let numberOfLoops = 0;

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
          lineSearch = lineSearch.substr(binaryIndexOfResult.length);
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
          lineSearch = lineSearch.substr(0, lineSearch.length - 1);
          if (!line) {
            whileContinue = false;
          }
        }
      }

      if (lineWithTags !== lineWithoutTags) {
        returnLine = backHtmlTags(returnLine, lineWithTags);
      }

      if (hasBoldOrItalic) {
        returnLine = fillBoldItalic(originalLine, returnLine);
      }

      return returnLine;
    },
    {
      concurrency: 5,
    },
  );

  return { lines: returnLines, text: generateHtml(returnLines) };
};
