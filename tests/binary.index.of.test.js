// @ts-check
const binaryIndexOf = require('../src/binary.index.of');

test('Full', () => {
  const text = 'Testofsearch';
  const search = 'search';
  const indexOfResult = binaryIndexOf(text, search);
  expect(indexOfResult.indexOf).toBe(6);
  expect(indexOfResult.length).toBe(6);
});

test('Incomplete middle', () => {
  const text = 'Testofsearch';
  const search = 'searchhcrae';
  const indexOfResult = binaryIndexOf(text, search);
  expect(indexOfResult.indexOf).toBe(6);
  expect(indexOfResult.length).toBe(6);
});

test('Incomplete', () => {
  const text = 'Testofsearch';
  const search = 'searchhcraertyu';
  const indexOfResult = binaryIndexOf(text, search);
  expect(indexOfResult.indexOf).toBe(6);
  expect(indexOfResult.length).toBe(6);
  expect(text.substr(indexOfResult.indexOf, indexOfResult.length)).toBe(
    'search',
  );
});

test('Incomplete with previous found', () => {
  const text = 'tesVtestofsearch';
  const search = 'testabbbb';
  const indexOfResult = binaryIndexOf(text, search);
  expect(indexOfResult.indexOf).toBe(4);
  expect(indexOfResult.length).toBe(4);
  expect(text.substr(indexOfResult.indexOf, indexOfResult.length)).toBe('test');
});

test.only('Not found', () => {
  const text = 'tesVtestofsearch';
  const search = 'YYYYYY';
  const indexOfResult = binaryIndexOf(text, search);
  expect(indexOfResult.indexOf).toBe(-1);
  expect(indexOfResult.length).toBe(0);
});
