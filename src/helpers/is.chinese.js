// @ts-check
const replaceall = require('replaceall');
let specialChars = require('./special-ideograms-chars');

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

specialChars = specialChars.concat(numbers, [' ']);

const chineseRange = [
  [0x4e00, 0x9fff], // CJK Unified Ideographs
  [0x3400, 0x4dbf], // CJK Unified Ideographs Extension A
  [0x20000, 0x2a6df], // CJK Unified Ideographs Extension B
  [0x2a700, 0x2b73f], // CJK Unified Ideographs Extension C
  [0x2b740, 0x2b81f], // CJK Unified Ideographs Extension D
  [0x2b820, 0x2ceaf], // CJK Unified Ideographs Extension E
  [0xf900, 0xfaff], // CJK Compatibility Ideographs

  [0x3300, 0x33ff], // https://en.wikipedia.org/wiki/CJK_Compatibility
  [0xfe30, 0xfe4f], // https://en.wikipedia.org/wiki/CJK_Compatibility_Forms
  [0xf900, 0xfaff], // https://en.wikipedia.org/wiki/CJK_Compatibility_Ideographs
  [0x2f800, 0x2fa1f], // https://en.wikipedia.org/wiki/CJK_Compatibility_Ideographs_Supplement
  [65311, 65311], // ponctuation ？
  [12289, 12290], // 、。
  [65306, 65306], // ：
];
module.exports = function isChinese(originalStr, removeSpecials) {
  let charCode;
  let flag = false;
  let range;

  let str = originalStr;

  if (!originalStr) {
    return { isChinese: false };
  }

  if (removeSpecials) {
    for (const specialChar of specialChars) {
      str = replaceall(specialChar, '', str);
    }

    if (!str && str !== originalStr) {
      return { isChinese: true, type: 'special' };
    }
  }

  for (let i = 0; i < str.length; i += 1) {
    charCode = str.codePointAt(i);

    flag = false;

    for (let j = 0; j < chineseRange.length; j += 1) {
      range = chineseRange[j];
      if (charCode >= range[0] && charCode <= range[1]) {
        flag = true;
        break;
      }
    }

    if (flag) {
      return { isChinese: true, type: 'ideograms' };
    }

    if (charCode <= 0xffff) {
      i += 1;
    } else {
      i += 2;
    }
  }

  return { isChinese: flag, type: 'ideograms' };
};
