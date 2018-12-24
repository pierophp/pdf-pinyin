// @ts-check
const pdfGetText = require('./src/pdf.get.txt');
const pdfResultParser = require('./src/pdf.result.parser.js');
const pinyinParser = require('./src/pinyin.parser');
const { stat, writeFile, readFile } = require('fs-extra');

(async function init() {
  let filename = 'data/w_f-lp_e-Pi_CHS_201809.pdf';
  const filenameTxt = `${filename}.txt`;
  const filenameParsed = `${filename}.parsed.json`;

  await pdfGetText(filename);
  return;

  let resultString = '';
  try {
    // throw new Error('Disable cache');
    await stat(filenameParsed);
    resultString = (await readFile(filenameParsed)).toString();
  } catch (e) {
    const content = (await readFile(filenameTxt)).toString();
    resultString = JSON.stringify(await pdfResultParser(content), null, 2);
    await writeFile(filenameParsed, resultString);
  }

  const resultObject = JSON.parse(resultString);

  const lines = [
    //'这项工作靠自愿捐款提供经费。',
    '耶和华见证人​是​一​群​快乐​的​人。他们​聚​在​一起​的​时候，无论​是​聚会、大会​或​是​一些​社交​场合，都​会​愉快​地​交谈，开怀​大​笑。为什么​他们​那么​快乐​呢？因为​他们​崇拜​的​是“快乐​的​上帝”，他们​认识​耶和华，而且​努力​效法​他。（提摩太前书​1:11；诗篇​16:11）耶和华​是​快乐​的​来源，他​也​希望​我们​得到​快乐。他​给​我们​很​多​喜乐​的​理由。（申命记​12:7；传道书​3:12,13）',
    //'本出版物是非卖品， 发行本出版物是全球圣经教育工作',
  ];

  await pinyinParser(resultObject, lines);
})();
