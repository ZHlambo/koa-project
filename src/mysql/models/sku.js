const Sequelize = require('sequelize');
import Cat from "./cat"
import {checkData, parseExcel} from '../../utils';
import skuJson from '../json/sku';

const sequelize = new Sequelize('lambo', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost'
});
const skuData = {
  name: {
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
const Sku = sequelize.define('sku', skuData, {
  freezeTableName: true, // Model 对应的表名将与model名相同
});

const hadName = async(body, id, ctx) => { // name 检查冲突
  if (body && body.name) {
    let result = await listSku({
      where: {
        name: body.name
      }
    }, ctx);
    for (var i = 0; i < result.length; i++) {
      if (result[i].id != id || !id) {
        ctx.send(400, {msg: "产品名已存在"});
        return true;
      }
    }
  }
}

const listSku = (query, ctx) => {
  console.log(query);
  return Sku.findAll(query).then((result) => {
    ctx.send(200, result);
    return result;
  });
}

const createSku = async(body, ctx) => {
  let check = checkData(body, skuJson.createSku);
  if (check)
    return ctx.send(400, check);

  let canUpdate = await Cat.getCatInfo(body.catid, ctx);
  if (!canUpdate)
    return;

  canUpdate = !await hadName(body, undefined, ctx);
  if (!canUpdate)
    return;

  return Sku.create(body).then((result, err) => {
    return ctx.send(200, result)
  });
}

const deleteSku = async(id, ctx) => {
  let result = await getSkuInfo(id, ctx);
  if (result) {
    let data = {
      deletedAt: result.deletedAt
        ? null
        : new Date()
    }
    return Sku.update(data, {where: {
        id
      }}).then(() => {
      return ctx.send(200, {
        msg: result.deletedAt
          ? "恢复成功"
          : "删除成功"
      });
    });
  }
}

const getSkuInfo = async(id, ctx) => {
  let result = await Sku.findOne({where: {
      id
    }});
  if (!result) {
    return ctx.send(404, {msg: "无效对象"});
  }
  ctx.send(200, result);
  return result;
}

const putSkuInfo = async(id, body, ctx) => {
  let check = checkData(body, skuJson.putSkuInfo);
  if (check) {
    return ctx.send(400, check);
  }
  let canUpdate = await getSkuInfo(id, ctx);
  if (!canUpdate)
    return;

  canUpdate = !await hadName(body, id, ctx);
  if (!canUpdate)
    return;

  return Sku.update(body, {where: {
      id
    }}).then(() => {
    ctx.send(200, {msg: "操作成功"})
  });
}

const getCatSkus = async(id, ctx) => {
  return listSku({
    where: {
      catid: id
    }
  }, ctx);
}

module.exports = {
  listSku,
  getCatSkus,
  createSku,
  deleteSku,
  getSkuInfo,
  putSkuInfo
}
