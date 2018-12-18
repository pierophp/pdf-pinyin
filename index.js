// @ts-check

const pdfResultParser = require('./src/pdf.result.parser.js');
const pinyinParser = require('./src/pinyin.parser');
const { stat, writeFile, readFile } = require('fs-extra');
let filename = 'data/tmp.pdf';
const filenameTxt = `${filename}.txt`;
const filenameParsed = `${filename}.parsed.json`;

(async function init() {
  let resultString = '';
  try {
    throw new Error('Disable cache');
    await stat(filenameParsed);
    resultString = (await readFile(filenameParsed)).toString();
  } catch (e) {
    resultString = JSON.stringify(await pdfResultParser(filenameTxt), null, 2);
    await writeFile(filenameParsed, resultString);
  }

  const resultObject = JSON.parse(resultString);

  const lines = [
    '耶和华见证人​是​一​群​快乐​的​人。他们​聚​在​一起​的​时候，无论​是​聚会、大会​或​是​一些​社交​场合，都​会​愉快​地​交谈，开怀​大​笑。为什么​他们​那么​',
    // '耶和华见证人​是​一​群​快乐​的​人。他们​聚​在​一起​的​时候，无论​是​聚会、大会​或​是​一些​社交​场合，都​会​愉快​地​交谈，开怀​大​笑。为什么​他们​那么​快乐​呢？因为​他们​崇拜​的​是“快乐​的​上帝”，他们​认识​耶和华，而且​努力​效法​他。（提摩太前书​1:11；诗篇​16:11）耶和华​是​快乐​的​来源，他​也​希望​我们​得到​快乐。他​给​我们​很​多​喜乐​的​理由。（申命记​12:7；传道书​3:12,13）',
  ];

  await pinyinParser(resultObject, lines);
})();
