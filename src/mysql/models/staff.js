import {jwtSign} from '../../utils';
const Sequelize = require('sequelize');

var sequelize = new Sequelize('lambo', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost'
});
var logData = {
  url: {
    type: Sequelize.DataTypes.STRING
  },
  method: {
    type: Sequelize.DataTypes.STRING
  },
  ip: {
    type: Sequelize.DataTypes.STRING
  },
  // staffName: {
  //   type: Sequelize.DataTypes.STRING
  // },
  body: {
    type: Sequelize.DataTypes.STRING
  },
  response: {
    type: Sequelize.DataTypes.STRING
  },
  createdAt: {
    type: Sequelize.DataTypes.DATE
  },
  updatedAt: {
    type: Sequelize.DataTypes.DATE
  }
}
var Log = sequelize.define('log', logData, {
  freezeTableName: true, // Model 对应的表名将与model名相同
});


const createLog = (body, ctx) => {
  return Log.create(body);
}

const staffLogin = async(body, ctx) => {
  if (body.name === "lambo" && body.password === "dord") {
    let token = await jwtSign({name: body.name, type: "manage"});
    return ctx.send(200, {
      token
    });
  } else {
    ctx.send(400, {msg: "账户或者密码错误"});
  }
}

module.exports = {
  staffLogin,
  createLog,
}
