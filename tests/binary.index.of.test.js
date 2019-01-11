// @ts-check
const binaryIndexOf = require('../src/helpers/binary.index.of');

test('Full', async () => {
  const text = 'Testofsearch';
  const search = 'search';
  const indexOfResult = await binaryIndexOf(text, search);
  expect(indexOfResult.indexOf).toBe(6);
  expect(indexOfResult.length).toBe(6);
});

test('Incomplete middle', async () => {
  const text = 'Testofsearch';
  const search = 'searchhcrae';
  const indexOfResult = await binaryIndexOf(text, search);
  expect(indexOfResult.indexOf).toBe(6);
  expect(indexOfResult.length).toBe(6);
});

test('Incomplete', async () => {
  const text = 'Testofsearch';
  const search = 'searchhcraertyu';
  const indexOfResult = await binaryIndexOf(text, search);
  expect(indexOfResult.indexOf).toBe(6);
  expect(indexOfResult.length).toBe(6);
  expect(text.substr(indexOfResult.indexOf, indexOfResult.length)).toBe(
    'search',
  );
});

test('Incomplete with previous found', async () => {
  const text = 'tesVtestofsearch';
  const search = 'testabbbb';
  const indexOfResult = await binaryIndexOf(text, search);
  expect(indexOfResult.indexOf).toBe(4);
  expect(indexOfResult.length).toBe(4);
  expect(text.substr(indexOfResult.indexOf, indexOfResult.length)).toBe('test');
});

test('Not found', async () => {
  const text = 'tesVtestofsearch';
  const search = 'YYYYYY';
  const indexOfResult = await binaryIndexOf(text, search);
  expect(indexOfResult.indexOf).toBe(-1);
  expect(indexOfResult.length).toBe(0);
});
