// @ts-check
const replaceall = require('replaceall');
const isChinese = require('../helpers/is.chinese');
const normalizeSearch = require('../helpers/normalize.search');
const removeSpaces = require('../helpers/remove.spaces');
const separatePinyinInSyllables = require('../helpers/separate-pinyin-in-syllables');

let map = {};
let mapIndex = 0;

async function parseCharacter(tmpCharacter, tmpPinyin) {
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
      beginWord = false;
      mapIndex++;
      currentType = 'special';
    }
  }
}

module.exports = async function pdfTxtParser(content) {
  let ideograms = '';

  const lines = content.split('\n').filter(item => item);

  const first10Lines = lines.slice(0, 10);
  const isChineseVerificationFirstLines = isChinese(
    first10Lines.join(''),
    true,
  );

  if (!isChineseVerificationFirstLines.isChinese) {
    return {
      isReadable: false,
    };
  }

  map = {};
  mapIndex = 0;

  let tmpPinyin;
  let tmpCharacter;

  for (let line of lines) {
    // \f is new page
    line = replaceall('\f', '', line);
    line = replaceall('_', '', line);
    line = line.trim();

    const isChineseVerification = isChinese(line, true);
    if (isChineseVerification.isChinese) {
      if (isChineseVerification.type === 'special') {
        line = removeSpaces(line);
        await parseCharacter(line, null);
        ideograms += line;
        continue;
      }

      if (tmpCharacter) {
        tmpCharacter = removeSpaces(tmpCharacter);
        await parseCharacter(tmpCharacter, null);
        ideograms += tmpCharacter;
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

      await parseCharacter(tmpCharacter, tmpPinyin);
      ideograms += tmpCharacter;

      tmpCharacter = null;
    }
  }

  return {
    isReadable: true,
    ideograms: await normalizeSearch(ideograms),
    map,
  };
};
