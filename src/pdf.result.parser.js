// @ts-check
const { readFile } = require('fs-extra');
const replaceall = require('replaceall');
const isChinese = require('./is.chinese');
const separatePinyinInSyllables = require('./separate-pinyin-in-syllables');
const removeSpaces = require('./remove.spaces');
module.exports = async function pdfResultParser(filename) {
  let pinyin = '';
  let ideograms = '';

  const content = (await readFile(filename)).toString();
  const lines = content.split('\n').filter(item => item);

  let tmpPinyin;
  let tmpCharacter;
  let map = {};
  let mapIndex = 0;
  let lineIndex = 0;
  let totalLines = lines.length;

  for (let line of lines) {
    lineIndex++;

    if (lineIndex % 10 === 0) {
      console.log(`${lineIndex}/${totalLines}`);
    }

    // \f is new page
    line = replaceall('\f', '', line);
    line = replaceall('_', '', line);
    line = line.trim();

    const isChineseVerification = isChinese(line, true);
    if (isChineseVerification.isChinese) {
      if (isChineseVerification.type === 'special') {
        ideograms += removeSpaces(line);
        continue;
      }

      tmpCharacter = line;
    } else {
      tmpPinyin = replaceall(' ', '', line);

      if (!tmpPinyin) {
        tmpCharacter = null;
        tmpPinyin = null;
        continue;
      }

      tmpPinyin = separatePinyinInSyllables(tmpPinyin, false);

      pinyin += tmpPinyin;
      tmpCharacter = removeSpaces(tmpCharacter);

      ideograms += tmpCharacter;
      let pinyinIndex = 0;
      let beginWord = true;

      if (!tmpCharacter) {
        continue;
      }

      for (
        let charIndex = 0;
        charIndex <= tmpCharacter.length;
        charIndex += 1
      ) {
        const chineseVerification = isChinese(tmpCharacter[charIndex], true);

        if (
          chineseVerification.isChinese &&
          chineseVerification.type === 'ideograms'
        ) {
          map[mapIndex] = {
            char: tmpCharacter[charIndex],
            pinyin: tmpPinyin[pinyinIndex],
            isChinese: true,
            beginWord,
          };
          pinyinIndex++;
          beginWord = false;
          mapIndex++;
        } else if (tmpCharacter[charIndex] && tmpCharacter[charIndex].trim()) {
          map[mapIndex] = {
            char: tmpCharacter[charIndex],
            isChinese: false,
          };
          mapIndex++;
        }
      }
    }
  }

  return { pinyin, ideograms, map };
};
