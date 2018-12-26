module.exports = function fillBoldItalic(originalLine, returnLine) {
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
};
