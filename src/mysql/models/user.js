const Sequelize = require('sequelize');
import {encrypt, jwtSign} from '../../utils';

var sequelize = new Sequelize('lambo', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost'
});
var userData = {
  name: {
    type: Sequelize.DataTypes.STRING
  },
  image: {
    type: Sequelize.DataTypes.STRING
  },
  phonenum: {
    type: Sequelize.DataTypes.STRING
  },
  password: {
    type: Sequelize.DataTypes.STRING
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
var User = sequelize.define('user', userData, {
  freezeTableName: true, // Model 对应的表名将与model名相同
});

const hadName = async(body, id, ctx) => {// name 检查冲突
  if (body && body.name) {
    let result = await listUser({where: {name: body.name}}, ctx);
    for (var i = 0; i < result.length; i++) {
      if (result[i].id != id || !id) {
        ctx.send(400, {msg: "用户名已存在"});
        return true;
      }
    }
  }
}

const listUser = (query, ctx) => {
  return User.findAll(query).then((result) => {
    ctx.send(200, result)
    return result;
  });
}

const createUser = async(body, ctx) => {
  let canUpdate = !await hadName(body, undefined, ctx);
  if (!canUpdate) return ;
  body.password = encrypt(body.password);
  return User.create(body).then((result) => {
    return ctx.send(200, result)
  });
}

const deleteUser = async(id, ctx) => {
  let result = await getUserInfo(id, ctx);
  if (result) {
    let data = {
      deletedAt: result.dataValues.deletedAt
        ? null
        : new Date()
    }
    return User.update(data, ctx.querykey(id, "id")).then(() => {
      return ctx.send(200, {
        msg: result.dataValues.deletedAt
          ? "恢复成功"
          : "删除成功"
      });
    });
  }
}

const getUserInfo = async(id, ctx) => {
  let result = await User.findOne(ctx.querykey(id, "id"));
  if (!result) {
    return ctx.send(404, {msg: "无效对象"});
  }
  ctx.send(200, result);
  return result;
}

const putUserInfo = async(body, id, ctx) => {
  let canUpdate = await getUserInfo(id, ctx);
  canUpdate = !canUpdate ? canUpdate : !await hadName(body, id, ctx);
  if (canUpdate) {
    if (body.password) {
      body.password = encrypt(body.password);
    }
    return User.update(body, ctx.querykey(id, "id")).then(() => {
      ctx.send(200, {msg: "操作成功"})
    });
  }
}

const userLogin = async(body, ctx) => {
  let result = await User.findOne({
    where: {
      name: body.name
    }
  });
  if (!result) {
    return ctx.send(400, {msg: "该用户未注册"});
  }

  let user = result.dataValues;
  if (user.password === encrypt(body.password)) {
    user.token = jwtSign({
      id: user.id,
      type: "client"
    });
    ctx.send(200, user);
  } else {
    ctx.send(400, {msg: "密码错误"});
  }
}

module.exports = {
  listUser,
  putUserInfo,
  getUserInfo,
  createUser,
  deleteUser,
  userLogin
}
