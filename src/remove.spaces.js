// @ts-check

const replaceall = require('replaceall');

module.exports = function removeSpaces(content) {
  if (!content) {
    return content;
  }

  content = replaceall(' ', '', content);
  content = content.replace(/[\u200B-\u200D\uFEFF]/g, ''); // replace zero width space to space
  content = replaceall(String.fromCharCode(160), '', content); // Convert NO-BREAK SPACE to SPACE
  content = replaceall(String.fromCharCode(8201), '', content); // Convert THIN SPACE to SPACE
  content = replaceall(String.fromCharCode(8203), '', content); // Zero Width Space

  return content;
};
