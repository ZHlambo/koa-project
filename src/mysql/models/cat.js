import sequelize from "../sequelize";
import Sequelize from "sequelize";

const catData = {
  name: {
    type: Sequelize.DataTypes.STRING
  },
  parentid: {
    type: Sequelize.DataTypes.INTEGER
  },
  level: {
    type: Sequelize.DataTypes.INTEGER
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
const Cat = sequelize.define('cat', catData, {
  freezeTableName: true, // Model 对应的表名将与model名相同
});

const rootCat = (query, ctx) => {
  return Cat.findAll(Object.assign(query || {}, {
    where: {
      level: 0
    }
  })).then((result) => {
    ctx.send(200, result);
  });
}

const hadName = async(body, id, ctx) => {// name 检查冲突
  if (body && body.name) {
    let result = await Cat.findAll({where: {name: body.name}});
    for (var i = 0; i < result.length; i++) {
      if ((result[i].id != id || !id) && body.level == result[i].level) {
        ctx.send(400, {msg: "分类名已存在"});
        return true;
      }
    }
  }
}

const getCatChild = (id, ctx) => {
  let filter = ctx.q;
  filter.where = filter.where || {};
  filter.where.parentid = id;
  return Cat.findAll(filter).then((result) => {
    return ctx.send(200, result);
  });
}

const createCat = async(body, ctx) => {
  let result = {level: -1};
  if (body.parentid != undefined) {
    result = await getCatInfo(body.parentid, ctx);
  }
  if (!result) return ;
  body.level = result.level + 1;
  result = !await hadName(body, result.id, ctx);
  if (!result) return ;
  return Cat.create(body).then((result) => {
    return ctx.send(200, result);
  });
}

const deleteCat = async(id, ctx) => {
  let result = await getCatInfo(id, ctx);
  if (result) {
    let data = {
      deletedAt: result.deletedAt
        ? null
        : new Date()
    }
    return Cat.update(data, ctx.querykey(id, "id")).then(() => {
      return ctx.send(200, {
        msg: result.deletedAt
          ? "恢复成功"
          : "删除成功"
      });
    });
  }
}

const getCatInfo = async(id, ctx) => {
  let result = await Cat.findOne(ctx.querykey(id, "id"));
  if (!result) {
    return ctx.send(404, {msg: "无效对象"});
  }
  ctx.send(200, result);
  return result;
}

const putCatInfo = async(id, body, ctx) => {
  let canUpdate = await getCatInfo(id, ctx);
  if (!canUpdate) return ;
  body.level = canUpdate.level;
  canUpdate = !await hadName(body, id, ctx);
  if (!canUpdate) return ;
  return Cat.update(body, ctx.querykey(id, "id")).then(() => {
    ctx.send(200, {msg: "操作成功"})
  });
}

module.exports = {
  rootCat,
  getCatChild,
  createCat,
  deleteCat,
  getCatInfo,
  putCatInfo
}
