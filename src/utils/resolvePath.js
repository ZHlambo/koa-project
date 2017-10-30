/*
 *����Ŀ¼��������jsģ��
 *
 * */
const fs = require('fs');
const path = require('path');

module.exports = function(dirpath, merged) {
  let files,
    paths = [];
  let _dirpath = path.resolve(dirpath);
  try {
    files = fs.readdirSync(_dirpath);
  } catch (e) {
    throw e;
  }
  for (let file of files) {
    if (file.match(/\.raml$/)) {
      paths.push({path: path.join(_dirpath, file),file: file.split(".")[0]});
    }
  }
  return paths;
}
