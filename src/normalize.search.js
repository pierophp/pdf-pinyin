const replaceall = require('replaceall');
module.exports = async function normalizeSearch(search) {
  search = replaceall('，', ',', search);
  search = replaceall('；', ';', search);
  search = replaceall('〈', "'", search);
  search = replaceall('〉', "'", search);
  search = replaceall('《', "'", search);
  search = replaceall('》', "'", search);
  search = replaceall('"', "'", search);

  return search;
};
