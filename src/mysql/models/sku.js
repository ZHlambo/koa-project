const Sequelize = require('sequelize');
import Cat from "./cat"
import {checkData} from '../../utils';
import skuJson from '../json/sku';

const sequelize = new Sequelize('lambo', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost'
});
const skuData = {
  title: {
    type: Sequelize.DataTypes.STRING
  },
  attr: {
    type: Sequelize.DataTypes.STRING
  },
  catid: {
    type: Sequelize.DataTypes.INTEGER
  },
  price: {
    type: Sequelize.DataTypes.FLOAT
  },
  images: {
    type: Sequelize.DataTypes.STRING
  },
  descs: {
    type: Sequelize.DataTypes.TEXT
  },
  createdAt: {
    type: Sequelize.DataTypes.DATE
  },
  updatedAt: {
    type: Sequelize.DataTypes.DATE
  },
  deletedAt: {
    type: Sequelize.DataTypes.DATE
  }
}
const sqlSku = sequelize.define('sku', skuData, {
  freezeTableName: true, // Model 对应的表名将与model名相同
});

const attrData = {
  "名称": "title",
  "属性": "attr",
  "价格": "pirce",
  "图片": "images",
  "描述": "descs"
}

const listSku = (query, cb) => {
  return sqlSku.findAll(query).then((result) => {
    return cb(200, result)
  });
}

const createSku = async(body, cb) => {
  let check = checkData(body, skuJson.createSku);
  if (check) {
    return cb(400, check);
  }
  let cat = await Cat.getCatInfo(body.catid, cb);
  if (!cat) {
    return;
  }
  return sqlSku.create(body).then((result, err) => {
    return cb(200, result)
  });
}

const deleteSku = async(id, cb) => {
  let result = await getSkuInfo(id, cb);
  if (result) {
    let data = {
      deletedAt: result.deletedAt
        ? null
        : new Date()
    }
    return sqlSku.update(data, {where: {
        id
      }}).then(() => {
      return cb(200, {
        msg: result.deletedAt
          ? "恢复成功"
          : "删除成功"
      });
    });
  }
}

const getSkuInfo = async(id, cb) => {
  let result = await sqlSku.findOne({where: {
      id
    }});
  if (!result) {
    return cb(401, {msg: "无效对象"});
  }
  cb(200, result);
  return result;
}

const putSkuInfo = async(id, body, cb) => {
  let check = checkData(body, skuJson.putSkuInfo);
  if (check) {
    return cb(400, check);
  }
  let result = await getSkuInfo(id, cb);
  if (result) {
    return sqlSku.update(body, {where: {
        id
      }}).then(() => {
      cb(200, {msg: "操作成功"})
    });
  }
}

const getCatSkus = async(id, cb) => {
  return listSku({
    where: {
      catid: id
    }
  }, cb);
}

module.exports = {
  listSku,
  getCatSkus,
  createSku,
  deleteSku,
  getSkuInfo,
  putSkuInfo
}
