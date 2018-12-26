const replaceall = require('replaceall');

function cleanSearch(search) {
  search = replaceall('*', '', search);
  return search;
}

async function binaryPartialSearch(
  text,
  search,
  lengthToSearch,
  partialSearchLevel,
) {
  partialSearchLevel++;
  let partialSearch = search.substr(0, lengthToSearch);
  let indexOf = text.indexOf(partialSearch);
  if (indexOf >= 0) {
    let newLengthToSearch = lengthToSearch;
    while (text.substr(indexOf, partialSearch.length) === partialSearch) {
      newLengthToSearch++;
      partialSearch = search.substr(0, newLengthToSearch);
    }

    let newIndexOf = text.indexOf(partialSearch);

    newLengthToSearch--;

    if (newIndexOf === -1) {
      return { indexOf, length: newLengthToSearch, partialSearchLevel };
    }

    return await binaryPartialSearch(
      text,
      search,
      newLengthToSearch + 1,
      partialSearchLevel,
    );
  }

  if (lengthToSearch === 1) {
    return { indexOf: -1, length: 0, partialSearchLevel };
  }

  return await binaryPartialSearch(
    text,
    search,
    Math.ceil(lengthToSearch / 2),
    partialSearchLevel,
  );
}

module.exports = async function binaryIndexOf(text, search, needsCleanSearch) {
  // full search
  let cleanedSearch = search;
  if (needsCleanSearch) {
    cleanedSearch = cleanSearch(search);
  }
  let indexOf = text.indexOf(cleanedSearch);
  if (indexOf === -1) {
    const lengthToSearch = Math.ceil(search.length / 2);
    return await binaryPartialSearch(text, search, lengthToSearch, 0);
  }

  return { indexOf, length: search.length, partialSearchLevel: 0 };
};
