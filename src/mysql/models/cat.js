const Sequelize = require('sequelize');

const sequelize = new Sequelize('lambo', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost'
});
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
const sqlCat = sequelize.define('cat', catData, {
  freezeTableName: true, // Model 对应的表名将与model名相同
});

const rootCat = (query, ctx) => {
  return sqlCat.findAll(Object.assign(query || {}, {
    where: {
      level: 0
    }
  })).then((result) => {
    ctx.send(200, result);
  });
}

const getCatChild = (id, ctx) => {
  return sqlCat.findAll({
    where: {
      parentid: id
    }
  }).then((result) => {
    return ctx.send(200, result);
  });
}

const createCat = async(body, ctx) => {
  let result = true;
  if (body.parentid != undefined) {
    result = await getCatInfo(body.parentid, ctx);
    if (result)
      body.level = result.level + 1;
    }
  else {
    body.level = 0;
  }
  if (result) {
    return sqlCat.create(body).then((result) => {
      return ctx.send(200, result)
    });
  }
}

const deleteCat = async(id, ctx) => {
  let result = await getCatInfo(id, ctx);
  if (result) {
    let data = {
      deletedAt: result.deletedAt
        ? null
        : new Date()
    }
    return sqlCat.update(data, ctx.querykey(id, "id")).then(() => {
      return ctx.send(200, {
        msg: result.deletedAt
          ? "恢复成功"
          : "删除成功"
      });
    });
  }
}

const getCatInfo = async(id, ctx) => {
  let result = await sqlCat.findOne(ctx.querykey(id, "id"));
  if (!result) {
    return ctx.send(404, {msg: "无效对象"});
  }
  ctx.send(200, result);
  return result;
}

const putCatInfo = async(id, body, ctx) => {
  let result = await getCatInfo(id, ctx);
  if (result) {
    return sqlCat.update(body, ctx.querykey(id, "id")).then(() => {
      ctx.send(200, {msg: "操作成功"})
    });
  }
}

module.exports = {
  rootCat,
  getCatChild,
  createCat,
  deleteCat,
  getCatInfo,
  putCatInfo
}
