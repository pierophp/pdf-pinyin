// @ts-check

const pdfResultParser = require('../src/pdf.result.parser');

test('No Pinyin', async () => {
  const content = `人数
rénshù
（2017 年
nián
）
12,082
本出版物是非卖品， 发行本出版物
是全球圣经教育工作的一部分， 这项
工作靠自愿捐款提供经费。
想自愿捐款， 请上www.jw.org网站。
除非另外注明，
所有经文引自
《圣经新世界译本》。
_____________________________________________________________________________________________________________________________________________________
11 月
yuè`;

  const result = await pdfResultParser(content);
  console.log(result);
  //   expect(isChineseResult.isChinese).toBe(true);
  //   expect(isChineseResult.type).toBe('ideograms');
});

test.only('No Pinyin', async () => {
  const content = `12,082
  本出版物是非卖品， 发行本出版物
  是全球圣经教育工作的一部分， 这项
  工作靠自愿捐款提供经费。
  想自愿捐款， 请上www.jw.org网站。
  除非另外注明，
  所有经文引自
  《圣经新世界译本》。
  _____________________________________________________________________________________________________________________________________________________
  11 月
  yuè`;
  const result = await pdfResultParser(content);

  const expectedResult =
    '12,082本出版物是非卖品，发行本出版物是全球圣经教育工作的一部分，这项工作靠自愿捐款提供经费。想自愿捐款，请上www.jw.org网站。除非另外注明，所有经文引自11月';

  expect(result.ideograms).toBe(expectedResult);
});
