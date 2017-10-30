var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost:27017/lambo", {useMongoClient: true});
var userScheMa = new mongoose.Schema({name: String, passwd: String, image: String});
var {creatUser, listUser} = require("../schema/UserSchema");
var User = {};
// const listUser = (ctx, next) => {
//   User.find({}, function(err, result) {
//     console.log(ctx.request);
//     ctx.response.status = 200;
//     ctx.response.body = "listUser";
//     console.log("listUser");
//   });
//   return "listUser";
// }
// const creatUser = (ctx, next) => {
//   console.log(User, ctx.request.body);
//   User.save(ctx.request.body, function(err, result) {
//     console.log(err, result);
//     ctx.response.status = 200;
//     ctx.response.body = JSON.stringify(result);
//     console.log("creatUser");
//   })
//   return "creatUser";
// }
const getUserInfo = () => {
  ctx.response.status = 200;
  ctx.response.body = "getUserInfo";
  console.log("getUserInfo");
  return "getUserInfo";
}
const updateUserInfo = () => {
  ctx.response.status = 200;
  ctx.response.body = "updateUserInfo";
  console.log("updateUserInfo");
  return "updateUserInfo";
}
const deleteUser = () => {
  ctx.response.status = 200;
  ctx.response.body = "deleteUser";
  console.log("deleteUser");
  return "deleteUser";
}
console.log(creatUser);
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
