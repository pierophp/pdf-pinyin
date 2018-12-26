module.exports = function debug(message) {
  if (process.env.DEBUG_LOG) {
    appendFile(`${__dirname}/../data/log.txt`, `${message}\n`).then();
  }
};
