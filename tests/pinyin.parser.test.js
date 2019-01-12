// @ts-check
const pinyinParser = require('../src/core/pinyin.parser');
const resultParser01 = require('./data/result.parser.01');
const resultParser02 = require('./data/result.parser.02');

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

test('Pinyin Parser 4', async () => {
  const result = await pinyinParser(resultParser02, [
    `耶和华仁慈地请我们将内心所有的感受都告诉他。（<bible text=\"19:50:15\">诗篇50:15；</bible><bible text=\"19:62:8\">62:8</bible>）<bible text=\"20:3:5\">箴言3:5</bible>劝勉我们`,
  ]);

  const expected = [
    [
      {
        c: ['耶', '和', '华'],
        p: ['Yē', 'hé', 'huá'],
      },
      {
        c: ['仁', '慈'],
        p: ['rén', 'cí'],
      },
      {
        c: ['地'],
        p: ['de'],
      },
      {
        c: ['请'],
        p: ['qǐng'],
      },
      {
        c: ['我', '们'],
        p: ['wǒ', 'men'],
      },
      {
        c: ['将'],
        p: ['jiāng'],
      },
      {
        c: ['内', '心'],
        p: ['nèi', 'xīn'],
      },
      {
        c: ['所', '有'],
        p: ['suǒ', 'yǒu'],
      },
      {
        c: ['的'],
        p: ['de'],
      },
      {
        c: ['感', '受'],
        p: ['gǎn', 'shòu'],
      },
      {
        c: ['都'],
        p: ['dōu'],
      },
      {
        c: ['告', '诉'],
        p: ['gào', 'su'],
      },
      {
        c: ['他'],
        p: ['tā'],
      },
      {
        c: ['。', '（'],
        p: [' ', ' '],
      },
      {
        c: ['诗', '篇'],
        p: ['Shī', 'piān'],
        tagsStart: '<bible text="19:50:15">',
      },
      {
        c: ['5', '0', ':', '1', '5', '；'],
        p: [' ', ' ', ' ', ' ', ' ', ' '],
      },
      {
        c: ['6', '2', ':', '8'],
        p: [' ', ' ', ' ', ' '],
        tagsStart: '</bible><bible text="19:62:8">',
      },
      {
        c: ['）'],
        p: [' '],
        tagsStart: '</bible>',
      },
      {
        c: ['箴', '言'],
        p: ['Zhēn', 'yán'],
        tagsStart: '<bible text="20:3:5">',
      },
      {
        c: ['3', ':', '5'],
        p: [' ', ' ', ' '],
      },
      {
        c: ['劝', '勉'],
        p: ['quàn', 'miǎn'],
        tagsStart: '</bible>',
      },
      {
        c: ['我', '们'],
        p: ['wǒ', 'men'],
      },
    ],
  ];

  expect(JSON.stringify(result.lines, null, 2)).toBe(
    JSON.stringify(expected, null, 2),
  );
});
