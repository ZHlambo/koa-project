const User = require("../../models/user");

const listUser = (req, cb) => {
  return User.listUser(req.q, cb)
}

const queryKey = (req, key) => {
  return {
    where: {
      [key]: req.params[key]
    }
  }
}

const createUser = (req, cb) => {
  return User.createUser(req.body || {}, cb);
}

const deleteUser = (req, cb) => {
  return User.deleteUser(req.params.id, cb);
}

const getUserInfo = (req, cb) => {
  return User.getUserInfo(req.params.id, cb);
}

const putUserInfo = (req, cb) => {
  return User.putUserInfo(req.body,req.params.id, cb);
}

module.exports = {
  listUser,
  putUserInfo,
  getUserInfo,
  createUser,
  deleteUser,
}
