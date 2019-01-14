const getPdfParsedObject = require('../src/core/get.pdf.parsed.object');
const pinyinParser = require('../src/core/pinyin.parser');

const fullFilename = [
  'https://download-a.akamaihd.net/files/media_magazines/2c/w_f-lp-1_e-Pi_CHS_20140715.pdf',
  'https://download-a.akamaihd.net/files/media_magazines/a0/w_f-lp-2_e-Pi_CHS_20140715.pdf',
].join('|||');

const lines = [`别人的叛道行为动摇不了提摩太对耶和华的信心（见第10-12段）`];

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
