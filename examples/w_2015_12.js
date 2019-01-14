const getPdfParsedObject = require('../src/core/get.pdf.parsed.object');
const pinyinParser = require('../src/core/pinyin.parser');

const fullFilename = [
  'https://download-a.akamaihd.net/files/media_magazines/80/w_f-lp-1_e-Pi_CHS_20151215.pdf',
  'https://download-a.akamaihd.net/files/media_magazines/09/w_f-lp-2_e-Pi_CHS_20151215.pdf',
].join('|||');

const lines = [
  `永恒 的 上帝 创造 了 天使 和 人类，让 他们 享受 生命，过 快乐 的 生活。（诗篇 36:9；提摩太前书 1:11）使徒 约翰 把“最 先 被 上帝 创造”的 天使 称 为“话语”。（约翰福音 1:1；启示录 3:14）这 位 天使 就是 耶和华 的 头生子，他 与 上帝 作伴，上帝 也 把 自己 的 想法 和 感受 告诉 他。（约翰福音 1:14，17；歌罗西书 1:15）使徒 保罗 也 曾 提 过“天使 的 语言”，这 种 语言 比 人类 的 语言 更 高等。（哥林多前书 13:1）`,
];

(async function init() {
  process.env.DEBUG_LOG = '1';
  const resultObject = await getPdfParsedObject(fullFilename, true);
  const result = await pinyinParser(resultObject, lines);

  if (!result.isReadable) {
    console.log('PDF not readable');
    return;
  }
})();
