// @ts-check
const replaceall = require('replaceall');
const TradOrSimp = require('traditional-or-simplified');
const { traditionalToSimplified } = require('node-opencc');

const isChinese = require('../helpers/is.chinese');
const normalizeSearch = require('../helpers/normalize.search');
const removeSpaces = require('../helpers/remove.spaces');
const separatePinyinInSyllables = require('../helpers/separate-pinyin-in-syllables');

let map = {};
let mapIndex = 0;

async function parseCharacter(tmpCharacter, tmpPinyin, tmpTraditional) {
  let pinyinIndex = 0;
  let beginWord = true;
  let currentType = '';

  for (let charIndex = 0; charIndex < tmpCharacter.length; charIndex += 1) {
    const chineseVerification = isChinese(tmpCharacter[charIndex], true);

    if (
      chineseVerification.isChinese &&
      chineseVerification.type === 'ideograms' &&
      tmpPinyin
    ) {
      if (currentType !== 'ideograms') {
        beginWord = true;
      }

      map[mapIndex] = {
        char: tmpCharacter[charIndex],
        pinyin: tmpPinyin[pinyinIndex],
        isChinese: true,
        beginWord,
      };

      if (tmpTraditional) {
        map[mapIndex].charT = tmpTraditional[charIndex];
      }

      pinyinIndex++;
      beginWord = false;
      mapIndex++;
      currentType = 'ideograms';
    } else if (tmpCharacter[charIndex] && tmpCharacter[charIndex].trim()) {
      if (currentType !== 'special') {
        beginWord = true;
      }

      map[mapIndex] = {
        char: tmpCharacter[charIndex],
        isChinese: false,
        beginWord,
      };

      if (tmpTraditional) {
        map[mapIndex].charT = tmpTraditional[charIndex];
      }

      beginWord = false;
      mapIndex++;
      currentType = 'special';
    }
  }
}

module.exports = async function pdfTxtParser(content) {
  let ideograms = '';
  let ideogramsT = '';

  const lines = content.split('\n').filter(item => item);

  const last20Lines = lines.slice(Math.max(lines.length - 5, 1));
  const isChineseVerificationLastLines = isChinese(last20Lines.join(''), true);

  if (!isChineseVerificationLastLines.isChinese) {
    return {
      isReadable: false,
    };
  }

  const isTraditional = TradOrSimp.isTraditional(last20Lines.join(''));

  map = {};
  mapIndex = 0;

  let tmpPinyin;
  let tmpCharacter;

  for (let line of lines) {
    // \f is new page
    line = replaceall('\f', '', line);
    line = replaceall('_', '', line);
    line = line.trim();

    const lineWithoutSpaces = removeSpaces(line);
    const isChineseVerification = isChinese(lineWithoutSpaces, true);

    if (isChineseVerification.isChinese) {
      if (isChineseVerification.type === 'special') {
        line = lineWithoutSpaces;

        let traditionalLine = null;
        if (isTraditional) {
          traditionalLine = line;
          line = traditionalToSimplified(line);
        }

        await parseCharacter(line, null, traditionalLine);
        ideograms += line;
        if (isTraditional) {
          ideogramsT += traditionalLine;
        }

        continue;
      }

      if (tmpCharacter) {
        tmpCharacter = lineWithoutSpaces;

        let traditionalLine = null;
        if (isTraditional) {
          traditionalLine = tmpCharacter;
          tmpCharacter = traditionalToSimplified(tmpCharacter);
        }

        await parseCharacter(tmpCharacter, null, traditionalLine);

        ideograms += tmpCharacter;
        if (isTraditional) {
          ideogramsT += traditionalLine;
        }
      }

      tmpCharacter = line;
    } else {
      const pinyinSeparated = line.split(' ');
      const pinyinSyllableWithOneLetter = pinyinSeparated.find(
        item => item.length === 1,
      );

      tmpPinyin = line;
      if (pinyinSyllableWithOneLetter) {
        tmpPinyin = pinyinSeparated.join('');
      }

      if (!tmpPinyin) {
        tmpCharacter = null;
        tmpPinyin = null;
        continue;
      }

      tmpPinyin = separatePinyinInSyllables(tmpPinyin, false);
      tmpCharacter = removeSpaces(tmpCharacter);

      if (!tmpCharacter) {
        continue;
      }

      let traditionalLine = null;
      if (isTraditional) {
        traditionalLine = tmpCharacter;
        tmpCharacter = traditionalToSimplified(tmpCharacter);
      }

      await parseCharacter(tmpCharacter, tmpPinyin, traditionalLine);

      ideograms += tmpCharacter;

      if (isTraditional) {
        ideogramsT += traditionalLine;
      }

      tmpCharacter = null;
    }
  }

  const response = {};
  response.isReadable = true;
  response.ideograms = await normalizeSearch(ideograms);

  if (ideogramsT) {
    response.ideogramsT = await normalizeSearch(ideogramsT);
  }

  response.map = map;

  return response;
};
