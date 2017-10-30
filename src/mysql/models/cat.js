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

const queryKey = (id, key) => {
  return {
    where: {
      [key]: id
    }
  }
}

const rootCat = (query, cb) => {
  return sqlCat.findAll(Object.assign(query || {}, {
    where: {
      level: 0
    }
  })).then((result) => {
    return cb(200, result);
  });
}

const getCatChild = (id, cb) => {
  return sqlCat.findAll({
    where: {
      parentid: id
    }
  }).then((result) => {
    return cb(200, result);
  });
}

const createCat = async (body, cb) => {
  let result = true;
  if (body.parentid != undefined) {
    result = await getCatInfo(body.parentid, cb);
    if (result) body.level = result.level + 1;
  } else {
    body.level = 0;
  }
  if (result) {
    return sqlCat.create(body).then((result) => {
      return cb(200, result)
    });
  }
}

const deleteCat = async (id, cb) => {
  let result = await getCatInfo(id, cb);
  if (result) {
    let data = {
      deletedAt: result.deletedAt ?
        null : new Date()
    }
    return sqlCat.update(data, queryKey(id, "id")).then(() => {
      return cb(200, {
        msg: result.deletedAt ?
          "恢复成功" : "删除成功"
      });
    });
  }
}

const getCatInfo = async (id, cb) => {
  let result = await sqlCat.findOne(queryKey(id, "id"));
  if (!result) {
    return cb(401, {
      msg: "无效对象"
    });
  }
  cb(200, result);
  return result;
}

const putCatInfo = async (id, body, cb) => {
  let result = await getCatInfo(id, cb);
  if (result) {
    return sqlCat.update(body, queryKey(id, "id")).then(() => {
      cb(200, {
        msg: "操作成功"
      })
    });
  }
}
console.log(getCatInfo);
module.exports = {
  rootCat,
  getCatChild,
  createCat,
  deleteCat,
  getCatInfo,
  putCatInfo
}
