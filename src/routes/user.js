var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost:27017/lambo", {useMongoClient: true});
var userScheMa = new mongoose.Schema({name: String, passwd: String, image: String});
var {creatUser, listUser} = require("../schema/UserSchema");
var User = {};

const getUserInfo = () => {
  ctx.response.status = 200;
  ctx.response.body = "getUserInfo";
  return "getUserInfo";
}
const updateUserInfo = () => {
  ctx.response.status = 200;
  ctx.response.body = "updateUserInfo";
  return "updateUserInfo";
}
const deleteUser = () => {
  ctx.response.status = 200;
  ctx.response.body = "deleteUser";
  return "deleteUser";
}
module.exports = [
  {
    url: "/users",
    method: "get",
    func: listUser
  }, {
    url: "/user",
    method: "post",
    func: creatUser
  }, {
    url: "/user/:userid",
    method: "del",
    func: deleteUser
  }, {
    url: "/user/:userid/info",
    method: "get",
    func: getUserInfo
  }, {
    url: "/user/:userid/info",
    method: "put",
    func: updateUserInfo
  }
]
