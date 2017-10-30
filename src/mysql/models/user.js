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

const queryKey = (id, key) => {
  return {
    where: {
      [key]: id
    }
  }
}

const listUser = (query, cb) => {
  return User.findAll(query).then((result) => {
    return cb(200, result)
  });
}

const createUser = (body, cb) => {
  body = body || {}
  if (body.password) {
    body.password = encrypt(body.password);
  }
  return User.create(body).then((result) => {
    return cb(200, result)
  });
}

const deleteUser = async(id, cb) => {
  let result = await getUserInfo(id, cb);
  if (result) {
    let data = {
      deletedAt: result.dataValues.deletedAt
        ? null
        : new Date()
    }
    return User.update(data, queryKey(id, "id")).then(() => {
      return cb(200, {
        msg: result.dataValues.deletedAt
          ? "恢复成功"
          : "删除成功"
      });
    });
  }
}

const getUserInfo = async(id, cb) => {
  let result = await User.findOne(queryKey(id, "id"));
  if (!result) {
    return cb(401, {msg: "无效对象"});
  }
  cb(200, result);
  return result;
}

const putUserInfo = async(body, id, cb) => {
  let result = await getUserInfo(id, cb);
  if (result) {
    body = body || {}
    if (body.password) {
      body.password = encrypt(body.password);
    }
    return User.update(body, queryKey(id, "id")).then(() => {
      cb(200, {msg: "操作成功"})
    });
  }
}

// var decoded = jwt.verify(token, 'secret');
const userLogin = async(body, cb) => {
  let result = await User.findOne({
    where: {
      name: body.name
    }
  });
  if (!result) {
    return cb(400, {msg: "该用户未注册"});
  }
  body = body || {}
  if (body.password) {
    body.password = encrypt(body.password);
  }
  let user = result.dataValues;
  if (result.password === encrypt(body.password)) {
    user.token = jwtSign({
      id: user.id,
      type: "client"
    });
    cb(200, user);
  } else {
    cb(400, {msg: "密码错误"});
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
