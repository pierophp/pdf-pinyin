const getPdfParsedObject = require('../src/core/get.pdf.parsed.object');
const pinyinParser = require('../src/core/pinyin.parser');

const fullFilename =
  'https://download-a.akamaihd.net/files/media_magazines/6c/w_f-lp_e-Pi_CHS_201811.pdf';

const lines = [
  `8 时间：我们​要​善用​时间，才​不​会​偏离​真理。有时，我们​一​不​小心​就​会​花​太​多​时间​在​消遣、嗜好、上网、看​电视​之​上。虽然​做​这些​事​没有​错，但​可能​会​占据​我们​原本​用​来​研读​和​从事​属灵​活动​的​时间。请​看看​埃玛 *姐妹​的​经历。埃玛​从​小​喜爱​马匹，她​只要​一​有​时间​就​会​去​骑​马。后来，她​觉得​自己​不​应该​花​这么​多​时间​在​嗜好​上，所以​她​调整​想法，不​再​把​休闲​娱乐​看​成​最​重要​的​事。另外，埃玛​从科莉·威尔斯​姐妹​的​经历得到​很​多​鼓励，科莉​曾经​从事​牛仔​竞技​表演。 *现在，埃玛​不​再​花​太​多​时间​骑​马​了，反而​用​更​多​时间​做​属灵​工作，也​很​享受​跟​崇拜​上帝​的​亲朋​好友​在​一起​的​时光。她​觉得​自己​跟​耶和华​的​关系​更​好​了，心里​很​踏实，也​很​高兴​自己​善用​时间。`,
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
