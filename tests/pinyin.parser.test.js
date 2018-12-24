// @ts-check
const pinyinParser = require('../src/pinyin.parser');

test('Pinyin Parser ', async () => {
  const resultParser = {
    ideograms: '我們是一個巴西人啊',
    map: {
      '0': {
        char: '我',
        pinyin: 'Wǒ',
        isChinese: false,
        beginWord: true,
      },
      '1': {
        char: '們',
        pinyin: 'men',
        isChinese: true,
        beginWord: false,
      },
      '2': {
        char: '是',
        pinyin: 'shì',
        isChinese: true,
        beginWord: true,
      },
      '3': {
        char: '一',
        pinyin: 'yī',
        isChinese: true,
        beginWord: true,
      },
      '4': {
        char: '個',
        pinyin: 'gè',
        isChinese: true,
        beginWord: true,
      },
      '5': {
        char: '巴',
        pinyin: 'Bā',
        isChinese: true,
        beginWord: true,
      },
      '6': {
        char: '西',
        pinyin: 'xī',
        isChinese: true,
        beginWord: false,
      },
      '7': {
        char: '人',
        pinyin: 'rén',
        isChinese: true,
        beginWord: false,
      },
      '8': {
        char: '啊',
        pinyin: 'a',
        isChinese: true,
        beginWord: true,
      },
    },
  };
  const result = await pinyinParser(resultParser, [
    '我們<b>是一個</b><i>巴西人</i>啊',
  ]);

  const expected = [
    [
      { c: ['我', '們'], p: ['Wǒ', 'men'] },
      { c: ['是'], p: ['shì'], isBold: true },
      { c: ['一'], p: ['yī'], isBold: true },
      { c: ['個'], p: ['gè'], isBold: true },
      { c: ['巴', '西', '人'], p: ['Bā', 'xī', 'rén'], isItalic: true },
      { c: ['啊'], p: ['a'] },
    ],
  ];

  expect(JSON.stringify(result, null, 2)).toBe(
    JSON.stringify(expected, null, 2),
  );
});
