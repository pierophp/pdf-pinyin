module.exports = function backHtmlTags(returnLine, lineWithTags) {
  let lineWithTagsCounter = 0;

  let returnLineCounter = 0;
  let returnLineIdeogramCounter = 0;
  let end = false;
  let newReturnLineCounter = 0;
  let newReturnLine = [];
  let tagStart = false;

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

    if (returnLineIdeogram === lineWithTags[lineWithTagsCounter] && !tagStart) {
      // @ts-ignore
      newReturnLine[newReturnLineCounter].c.push(returnLineIdeogram);
      // @ts-ignore
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

    if (lineWithTags[lineWithTagsCounter] === '<') {
      tagStart = true;
    } else if (lineWithTags[lineWithTagsCounter] === '>') {
      tagStart = false;
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
};
