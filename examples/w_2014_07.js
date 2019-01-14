const getPdfParsedObject = require('../src/core/get.pdf.parsed.object');
const pinyinParser = require('../src/core/pinyin.parser');

const fullFilename = [
  'https://download-a.akamaihd.net/files/media_magazines/2c/w_f-lp-1_e-Pi_CHS_20140715.pdf',
  'https://download-a.akamaihd.net/files/media_magazines/a0/w_f-lp-2_e-Pi_CHS_20140715.pdf',
].join('|||');

const lines = [
  `一天早上，大祭司亚伦拿着火盘，加上香，站在耶和华会幕的门口。在亚伦附近，可拉和250个首领也各自拿着火盘，要向耶和华献香。（民数记16:16-18）乍看起来，这群拿着火盘的男子全都是忠心崇拜耶和华的人。但实情是，在他们当中只有亚伦忠于上帝。其他人却妄自尊大，企图夺取祭司的职分，背叛耶和华。（民数记16:1-11）他们自欺欺人，以为上帝会悦纳他们的崇拜。可拉和250个首领这么做，根本没有将耶和华放在眼里。要知道，耶和华能洞悉人心，看穿他们的虚伪。（耶利米书17:10）`,
];

(async function init() {
  process.env.DEBUG_LOG = '1';
  process.env.NO_CACHE = '1';
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
