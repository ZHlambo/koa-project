const User = require("../../models/user");

const deleteUser = (ctx) => {
  return User.deleteUser(ctx.request.data.id, ctx);
}

const getUserInfo = (ctx) => {
  return User.getUserInfo(ctx.request.data.id, ctx);
}

const putUserInfo = (ctx) => {
  return User.putUserInfo(ctx.request.body,ctx.request.data.id, ctx);
}

const userLogin = (ctx) => {
  return User.userLogin(ctx.request.body,ctx);
}

module.exports = {
  putUserInfo,
  getUserInfo,
  deleteUser,
  userLogin
}
