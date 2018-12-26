module.exports = async function importPinyin(
  pdfResultParsed,
  line,
  indexOf,
  isFounded,
) {
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
};
