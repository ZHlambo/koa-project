import crypto from 'crypto';
import xlsx from "node-xlsx";
import jwt from 'jsonwebtoken';

export const checkData = (data, checkTemplate) => {
  if (!data)
    return;
  for (let key in data) {
    if (!checkTemplate[key]) {
      return {msg: `不允许参数 ${key}`}
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
  let md5 = crypto.createHash('md5');
  let password = md5.update('lambo_koa_project').digest('base64');
  // let sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
  // sha1.update(str);
  // let password = sha1.digest("hex");  //加密后的值d
  return password;
}

export const getVOO = (obj, keys) => {
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

export const parseExcel = (path) => {
  let workSheetsFromFile = xlsx.parse(path);
  let attr,obj={};
  let array = [];
  let attrData = {
    "名称": "title",
    "属性": "attr",
    "价格": "pirce",
    "图片": "images",
    "描述": "descs"
  }
  for (let i = 0; i < workSheetsFromFile.length; i++) {
    if (workSheetsFromFile[i].data && workSheetsFromFile[i].data instanceof Array) {
      attr = workSheetsFromFile[i].data[0];
      if (!attr) break;
      for (let m = 0; m < attr.length; m++) {
        attr[m] = attrData[attr[m]];
      }
      for (let j = 0; j < workSheetsFromFile[i].data.length; j++) {
        if (workSheetsFromFile[i].data[j].length == attr.length) {
          for (let k = 0; k < attr.length; k++) {
            obj[attr[k]] = workSheetsFromFile[i].data[j][k];
          }
          array.push(obj);
        } else {
          return {msg: "数据格式有误，请重新下载模版并填写"};
        }
      }
    }
  }
  return array;
}
