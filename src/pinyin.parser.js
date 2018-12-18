// @ts-check
const removeSpaces = require('./remove.spaces');

module.exports = async function pinyinParser(pdfResultParsed, lines = []) {
  for (let line of lines) {
    line = removeSpaces(line);

    let indexOf = pdfResultParsed.ideograms.indexOf(line);

    let whileContinue = true;

    let notFoundYet = '';

    while (whileContinue) {
      if (indexOf >= 0) {
        console.log('Encontrou: ', line);

        if (notFoundYet) {
          line = notFoundYet;
        } else {
          whileContinue = false;
        }
      } else {
        notFoundYet = line.substr(-1) + notFoundYet;
        line = line.substr(0, line.length - 1);
        indexOf = pdfResultParsed.ideograms.indexOf(line);

        if (indexOf === -1 && !line) {
          console.log('Nao Encontrou');
          whileContinue = false;
        }
      }
    }

    console.log(indexOf);
  }
};
