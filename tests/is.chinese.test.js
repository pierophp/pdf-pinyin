// @ts-check
const isChinese = require('../src/helpers/is.chinese');

test('Ideograms', () => {
  const isChineseResult = isChinese('理由');
  expect(isChineseResult.isChinese).toBe(true);
  expect(isChineseResult.type).toBe('ideograms');
});

test('Pinyin', () => {
  const isChineseResult = isChinese('Women');
  expect(isChineseResult.isChinese).toBe(false);
});

test('Ideograms + Special (NOT REMOVE SPECIAL)', () => {
  const isChineseResult = isChinese('。 （ 我們');
  expect(isChineseResult.isChinese).toBe(true);
});

test('Ideograms + Special (REMOVE SPECIAL)', () => {
  const isChineseResult = isChinese('。 （ 我們', true);
  expect(isChineseResult.isChinese).toBe(true);
  expect(isChineseResult.type).toBe('ideograms');
});

test('Special (REMOVE SPECIAL)', () => {
  const isChineseResult = isChinese('3，12,13）', true);
  expect(isChineseResult.isChinese).toBe(true);
  expect(isChineseResult.type).toBe('special');
});
