// @ts-check
const pdfTxtParser = require('../../src/core/pdf.txt.parser');

test.only('PDF Txt Parser', async () => {
  const content = `不尽
bújìn
。
３． 你
Nǐ
表现
biǎoxiàn
的
de`;

  const result = await pdfTxtParser(content);

  const expected = {
    isReadable: true,
    ideograms: '不尽。３．你表现的',
    map: {
      '0': { char: '不', pinyin: 'bú', isChinese: true, beginWord: true },
      '1': { char: '尽', pinyin: 'jìn', isChinese: true, beginWord: false },
      '2': { char: '。', isChinese: false, beginWord: true },
      '3': { char: '３', isChinese: false, beginWord: true },
      '4': { char: '．', isChinese: false, beginWord: false },
      '5': { char: '你', pinyin: 'Nǐ', isChinese: true, beginWord: true },
      '6': { char: '表', pinyin: 'biǎo', isChinese: true, beginWord: true },
      '7': { char: '现', pinyin: 'xiàn', isChinese: true, beginWord: false },
      '8': { char: '的', pinyin: 'de', isChinese: true, beginWord: true },
    },
  };

  expect(JSON.stringify(result, null, 2)).toBe(
    JSON.stringify(expected, null, 2),
  );
});
