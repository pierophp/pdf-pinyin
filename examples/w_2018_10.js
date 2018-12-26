const getPdfParsedObject = require('../src/core/get.pdf.parsed.object');
const pinyinParser = require('../src/core/pinyin.parser');

const fullFilename =
  'https://download-a.akamaihd.net/files/media_magazines/f3/w_f-lp_e-Pi_CHS_201810.pdf';

const lines = [
  `3 为什么要取名为“教导工具箱”，而不是“传道工具箱”呢？“传道”的意思是宣告某个信息，但“教导”的意思是让信息深入人的内心，使他们因为学到的道理而采取行动。我们能够宣扬真理的时间所剩不多，因此我们必须努力帮助人接受圣经课程，教导他们认识真理。既然如此，我们就需要努力找出“秉性适宜得永生的人”，使他们成为耶稣的门徒。（请读使徒行传13:44-48）`,
];

(async function init() {
  process.env.DEBUG_LOG = '1';
  const resultObject = await getPdfParsedObject(fullFilename, true);
  const result = await pinyinParser(resultObject, lines);

  let ideograms = '';
  let pinyin = '';
  for (const block of result[0]) {
    ideograms += block.c.join('') + ' ';
    pinyin += block.p.join('') + ' ';
  }

  console.log(pinyin);
  console.log(ideograms);
})();
