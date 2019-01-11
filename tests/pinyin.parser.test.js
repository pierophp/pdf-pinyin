// @ts-check
const pinyinParser = require('../src/core/pinyin.parser');

const resultParser01 = {
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

test('Pinyin Parser ', async () => {
  const result = await pinyinParser(resultParser01, [
    '我們<b>是一個</b><i>巴西人</i>啊',
  ]);

  const expected = [
    [
      { c: ['我', '們'], p: ['Wǒ', 'men'] },
      { c: ['是'], p: ['shì'], tagsStart: '<b>', isBold: true },
      { c: ['一'], p: ['yī'], isBold: true },
      { c: ['個'], p: ['gè'], isBold: true },
      {
        c: ['巴', '西', '人'],
        p: ['Bā', 'xī', 'rén'],
        tagsStart: '</b><i>',
        isItalic: true,
      },
      { c: ['啊'], p: ['a'], tagsStart: '</i>' },
    ],
  ];

  expect(JSON.stringify(result.lines, null, 2)).toBe(
    JSON.stringify(expected, null, 2),
  );
});

test('Pinyin Parser 2', async () => {
  const result = await pinyinParser(resultParser01, [
    '<div class="teste">我們<b>是一個</b><i>巴西人</i><span>啊</span></div>',
  ]);

  const expected = [
    [
      { c: ['我', '們'], p: ['Wǒ', 'men'], tagsStart: '<div class="teste">' },
      { c: ['是'], p: ['shì'], tagsStart: '<b>', isBold: true },
      { c: ['一'], p: ['yī'], isBold: true },
      { c: ['個'], p: ['gè'], isBold: true },
      {
        c: ['巴', '西', '人'],
        p: ['Bā', 'xī', 'rén'],
        tagsStart: '</b><i>',
        isItalic: true,
      },
      {
        c: ['啊'],
        p: ['a'],
        tagsStart: '</i><span>',
        tagsEnd: '</span></div>',
      },
    ],
  ];

  expect(JSON.stringify(result.lines, null, 2)).toBe(
    JSON.stringify(expected, null, 2),
  );
});

test('Pinyin Parser 3', async () => {
  const result = await pinyinParser(resultParser01, [
    '<div class="teste">我們<b>是一個</b><i>巴西</i>人<span>啊</span></div>',
  ]);

  const expected = [
    [
      { c: ['我', '們'], p: ['Wǒ', 'men'], tagsStart: '<div class="teste">' },
      { c: ['是'], p: ['shì'], tagsStart: '<b>', isBold: true },
      { c: ['一'], p: ['yī'], isBold: true },
      { c: ['個'], p: ['gè'], isBold: true },
      {
        c: ['巴', '西'],
        p: ['Bā', 'xī'],

        tagsStart: '</b><i>',
        isItalic: true,
      },
      {
        c: ['人'],
        p: ['rén'],
        tagsStart: '</i>',
      },
      {
        c: ['啊'],
        p: ['a'],
        tagsStart: '<span>',
        tagsEnd: '</span></div>',
      },
    ],
  ];

  expect(JSON.stringify(result.lines, null, 2)).toBe(
    JSON.stringify(expected, null, 2),
  );
});
