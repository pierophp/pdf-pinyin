const separatePinyinInSyllables = require('../../src/helpers/separate-pinyin-in-syllables');

test('Separate', async () => {
  const tests = [
    {
      input: 'fènwài ēndiǎn',
      expected: ['fèn', 'wài', 'ēn', 'diǎn'],
    },
  ];

  for (const test of tests) {
    expect(JSON.stringify(separatePinyinInSyllables(test.input), null, 2)).toBe(
      JSON.stringify(test.expected, null, 2),
    );
  }
});
