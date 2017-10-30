import sku from "../../models/sku";

const parseExcel = (path) => {
  var workSheetsFromFile = xlsx.parse(path);
  let attr;
  let array = [];
  for (var i = 0; i < workSheetsFromFile.length; i++) {
    if (workSheetsFromFile[i].data && workSheetsFromFile[i].data instanceof Array) {
      attr = workSheetsFromFile[i].data[0];
      for (var l = 0; l < attr.length; l++) {
        attr[l] = attrData[attr[l]];
      }
      for (var j = 0; j < workSheetsFromFile[i].data.length; j++) {
        if (workSheetsFromFile[i].data[j].length == attr.length) {
          for (var k = 0; k < attr.length; k++) {
            array.push({
              [attr[k]]: workSheetsFromFile[i].data[j][k]
            })
          }
        } else {
          return {msg: "数据格式有误，请重新下载模版并填写"};
        }
      }
    }
  }
  return array;
}

const listSku = (req, cb) => {
  return sku.listSku(req.query, cb);
}

const getSkuInfo = (req, cb) => {
  return sku.getSkuInfo(req.params.id, cb);
}

module.exports = {
  listSku,
  getSkuInfo,
}
