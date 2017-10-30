/*
 *����Ŀ¼��������jsģ��
 *
 * */
const fs = require('fs');
const path = require('path');

module.exports = function(dirpath, merged) {
  let files,
    exps = {};
  let _dirpath = path.resolve(dirpath);
  try {
    files = fs.readdirSync(_dirpath);
  } catch (e) {
    throw e;
  }
  for (let file of files) {
    if (file.match(/\.js$/)) {
      let ep = require(path.join(_dirpath, file));
      if (typeof ep === 'object') {
        if (merged) {
          for (const func in ep) {
            exps[func] = ep[func];
          }
        } else {
          exps[file.slice(0, -3)] = ep
        }
      } else {
        throw Error(`expect module ${path.join(dirpath, file)} export as object`)
      }
    }
  }
  return exps;
}
