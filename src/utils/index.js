const crypto = require('crypto');
const jwt = require('jsonwebtoken');

export const checkData = (data,checkTemplate) => {
  if (!data) return ;
  for (let key in data) {
    if (!checkTemplate[key]) {
      delete data[key];
    } else {
      if (typeof data[key] != checkTemplate[key].type) {
        return {msg: `${key}格式有误，格式必须为${checkTemplate[key].type}`}
      }
    }
  }
}
export const jwtSign = (data, time) => {
  return jwt.sign(data, 'secret', {
    expiresIn: time || 60 * 60 * 24
  })
}
export const encrypt = (str) => {
  var md5 = crypto.createHash('md5');
  var password = md5.update('lambo_koa_project').digest('base64');
  // var sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
  // sha1.update(str);
  // var password = sha1.digest("hex");  //加密后的值d
  return password;
}
export const queryKey = (obj, key, element) => {
  return {
    where: {
      [element || key]: getOOKS(obj, key)
    }
  }
}

export const getOOKS = (obj, keys) => {
  if (!obj) {
    return obj;
  }

  let value;
  keys = keys && keys.split(".");
  if (keys instanceof Array && keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      value = obj[keys[i]];
    }
  }

  return value;
}

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
