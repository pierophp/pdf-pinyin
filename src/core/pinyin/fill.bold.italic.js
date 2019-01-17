module.exports = function fillBoldItalic(originalLine, returnLine) {
  let isBold = false;
  let isItalic = false;

  let originalLineCounter = 0;
  let returnLineCounter = 0;
  let characterCounter = 0;
  while (originalLineCounter < originalLine.length) {
    if (returnLineCounter >= returnLine.length) {
      break;
    }

    if (originalLine.substr(originalLineCounter, 3) === '<b>') {
      isBold = true;
      originalLineCounter += 3;
      continue;
    }

    if (originalLine.substr(originalLineCounter, 4) === '</b>') {
      isBold = false;
      originalLineCounter += 4;
      continue;
    }

    if (originalLine.substr(originalLineCounter, 3) === '<i>') {
      isItalic = true;
      originalLineCounter += 3;
      continue;
    }

    if (originalLine.substr(originalLineCounter, 4) === '</i>') {
      isItalic = false;
      originalLineCounter += 4;
      continue;
    }

    const character = returnLine[returnLineCounter].c[characterCounter];

    if (originalLine[originalLineCounter] === character) {
      if (isBold) {
        returnLine[returnLineCounter].isBold = true;
      }

      if (isItalic) {
        returnLine[returnLineCounter].isItalic = true;
      }
      characterCounter++;
    }

    if (characterCounter === returnLine[returnLineCounter].c.length) {
      characterCounter = 0;
      returnLineCounter++;
    }

    originalLineCounter++;
  }

  return returnLine;
};
