const User = require("../../models/user");

const deleteUser = (req, cb) => {
  return User.deleteUser(req.data.id, cb);
}

const getUserInfo = (req, cb) => {
  return User.getUserInfo(req.data.id, cb);
}

const putUserInfo = (req, cb) => {
  return User.putUserInfo(req.body,req.data.id, cb);
}

const userLogin = (req, cb) => {
  return User.userLogin(req.body,cb);
}

module.exports = {
  putUserInfo,
  getUserInfo,
  deleteUser,
  userLogin
}
