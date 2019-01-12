const getPdfParsedObject = require('../src/core/get.pdf.parsed.object');
const pinyinParser = require('../src/core/pinyin.parser');

const fullFilename =
  'https://download-a.akamaihd.net/files/media_magazines/6c/w_f-lp_e-Pi_CHS_201811.pdf';

const lines = [
  `耶和华仁慈地请我们将内心所有的感受都告诉他。（<bible text=\"19:50:15\">诗篇50:15；</bible><bible text=\"19:62:8\">62:8</bible>）<bible text=\"20:3:5\">箴言3:5</bible>劝勉我们`,
];

(async function init() {
  process.env.DEBUG_LOG = '1';
  const resultObject = await getPdfParsedObject(fullFilename, true);
  const result = await pinyinParser(resultObject, lines);

  let ideograms = '';
  let pinyin = '';

  for (const block of result.lines[0]) {
    ideograms += block.c.join('') + ' ';
    pinyin += block.p.join('') + ' ';
  }

  console.log(pinyin);
  console.log(ideograms);
})();
