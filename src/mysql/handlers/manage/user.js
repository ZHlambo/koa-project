const User = require("../../models/user");

const listUser = (ctx) => {
  return User.listUser(ctx.request.q, ctx)
}

const createUser = (ctx) => {
  return User.createUser(ctx.request.body || {}, ctx);
}

const deleteUser = (ctx) => {
  return User.deleteUser(ctx.request.params.id, ctx);
}

const getUserInfo = (ctx) => {
  return User.getUserInfo(ctx.request.params.id, ctx);
}

const putUserInfo = (ctx) => {
  return User.putUserInfo(ctx.request.body,ctx.request.params.id, ctx);
}

module.exports = {
  listUser,
  putUserInfo,
  getUserInfo,
  createUser,
  deleteUser,
}
