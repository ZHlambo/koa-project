import crypto from 'crypto';
import xlsx from "node-xlsx";
import jwt from 'jsonwebtoken';
import mysql from "../mysql";

export const check = (data, checkTemplate, parent) => {
  let err = [];
  if (!data)
    return;
  for (let key in checkTemplate) {
    if (data[key] == undefined && checkTemplate[key].must) {
      err.push({msg: `缺少参数 ${parent ? `${parent}.${key}` : key}`});
    }
  }
  for (let key in data) {
    if (!checkTemplate[key]) {
      err.push({msg: `不允许参数  ${parent ? `${parent}.${key}` : key}`});
    } else {
      if (checkTemplate[key].type == "array") {
        if (!(data[key] instanceof Array)) {
          err.push({msg: `参数 ${parent ? `${parent}.${key}` : key} 类型有误，类型必须为 ${checkTemplate[key].type}`});
          continue;
        }
      } else if (typeof data[key] != (checkTemplate[key].type || "string")) {// NOTE: 默认参数类型为字符串
        err.push({msg: `参数 ${parent ? `${parent}.${key}` : key} 类型有误，类型必须为 ${checkTemplate[key].type || "string"}`});
        continue;
      }

      // NOTE: object 继续深层解析
      if (checkTemplate[key].child) {
        if (checkTemplate[key].type == "object") {
          let childErr = check(data[key], checkTemplate[key].child, (parent ? `${parent}.` : "") + key);
          if (childErr) {
            err = err.concat(childErr.err);
          }
        } else if (data[key] instanceof Array) {
          if (key === "standard") {
            console.log(parent, key);
          }
          for (let i = 0; i < data[key].length; i++) {
            // let childErr = check(data[key][i], checkTemplate[key].child, (parent ? `${parent}.` : "") + `${key}[${i}]`);
            let childErr = check(data[key][i], checkTemplate[key].child, (parent ? `${parent}.` : "") + `${key}`);
            if (childErr) {
              err = err.concat(childErr.err);
              break;
            }
          }
        }
      }

      if (checkTemplate[key].regexp) {
        if (!new RegExp(checkTemplate[key].regexp).test(data[key])) {
          err.push({msg: `参数 ${parent ? `${parent}.${key}` : key} 格式有误，格式必须为 ${checkTemplate[key].regexp}`});
        }
      }
      if (checkTemplate[key].max) {
        if (data[key].length > checkTemplate[key].max) {
          err.push({msg: `参数 ${parent ? `${parent}.${key}` : key} 长度不能超过${checkTemplate[key].max}`});
        }
      }
      if (checkTemplate[key].min) {
        if (data[key].length < checkTemplate[key].min) {
          err.push({msg: `参数 ${parent ? `${parent}.${key}` : key} 长度不能小于${checkTemplate[key].min}`});
        }
      }
      if (checkTemplate[key].len) {
        if (data[key].length != checkTemplate[key].len) {
          err.push({msg: `参数 ${parent ? `${parent}.${key}` : key} 长度必须等于${checkTemplate[key].len}`});
        }
      }
    }
  }
  if (err.length) {
    return {code: 1, msg: err[0].msg, err};
  }
}
export const jwtSign = (data, time = 7) => {
  let token;
  try {
    token = jwt.sign(data, 'secret', {
      expiresIn: time || 60 * 60 * 24
    })
  } catch (e) {} finally {};
  return token;
}
// export const encrypt = (str) => {
//   let md5 = crypto.createHash('md5');
//   let password = md5.update(str || "").digest('base64');
//   // let sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
//   // sha1.update(str);
//   // let password = sha1.digest("hex");  //加密后的值d
//   return password;
// }

export const getVOO = (obj, keys) => {
  let value;
  keys = keys && keys.split(".");
  if (keys instanceof Array && keys.length > 0) {
    value = obj;
    for (let i = 0; i < keys.length; i++) {
      if (!value) return value;
      value = value[keys[i]];
    }
  }
  return value;
}

export const getVOA = (array, key, value, returnKey) => {
  if (!array)
    return undefined;
  for (let i in array) {
    if (getVOO(array[i], key) === value) {
      if (returnKey)
        return array[i][returnKey]
      else
        return array[i]
    }
  }
  return undefined;
}

export const parseExcel = (path) => {
  let workSheetsFromFile = xlsx.parse(path);
  let attr,
    obj = {};
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
      if (!attr)
        break;
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
// NOTE: 32位系统唯一ID
export const getUuid = async () => {
  let uuid = await mysql(`select replace(uuid(), '-', '') as uuid;`);
  uuid = uuid[0];
  return uuid.uuid;
}
// NOTE: table 表 随机生成 最小是8位数 1开头 的ID
export const getId = async (table) => {
  let result = await mysql(`select id from ${table} order by id DESC limit 1`);
  let id = result[0] && result[0].id || 1;
  // NOTE: id 至少为4位
  id = id + 1000;
  // NOTE: 4位随机数 补0
  let date_str = (Array(4).join(0) + (Math.random()*10000).toFixed(0)).slice(-4);
  // NOTE: id 前面数字最少两位补0
  let id_str_start = (Array(2).join(0) + Math.floor(id/100)).slice(-2);;
  // NOTE: id 后两位 补0
  let id_str_end = (Array(2).join(0) + id).slice(-2);
  return `${id_str_start}${date_str.substr(0,2)}${id_str_end}${date_str.substr(2,2)}`;
}
