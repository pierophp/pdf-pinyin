// @ts-check
const removeSpaces = require('./remove.spaces');

async function importPinyin(pdfResultParsed, line, indexOf) {
  let index = indexOf;
  for (let lineIndex = 0; lineIndex <= line.length; lineIndex++) {
    const mapItem = pdfResultParsed.map[index];
    console.log(mapItem);
    index++;
  }

  console.log(line);
}

module.exports = async function pinyinParser(pdfResultParsed, lines = []) {
  for (let line of lines) {
    line = removeSpaces(line);

    let indexOf = pdfResultParsed.ideograms.indexOf(line);

    let whileContinue = true;

    let notFoundYet = '';

    let numberOfLoops = 0;
    let maxNumberOfLoops = 5000;

    if (indexOf >= 0) {
      await importPinyin(pdfResultParsed.line, indexOf);
      console.log('Encontrou de Primeira: ', line);
      console.log(indexOf);
    } else {
      while (whileContinue) {
        numberOfLoops++;
        if (numberOfLoops > maxNumberOfLoops) {
          whileContinue = false;
        }

        if (indexOf >= 0) {
          console.log('Encontrou: ', line);
          console.log(indexOf);

          await importPinyin(pdfResultParsed.line, indexOf);

          indexOf = -1;

          if (notFoundYet) {
            line = notFoundYet.trim();
            notFoundYet = '';
          } else {
            whileContinue = false;
          }
        } else {
          notFoundYet = line.substr(-1) + notFoundYet;
          line = line.substr(0, line.length - 1);

          indexOf = pdfResultParsed.ideograms.indexOf(line);

          if (indexOf === -1 && !line) {
            whileContinue = false;
          }
        }
      }
    }

    console.log(indexOf);
  }
};
