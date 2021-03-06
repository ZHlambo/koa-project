var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost:27017/lambo", {useMongoClient: true});
var userScheMa = new mongoose.Schema({name: String, passwd: String, image: String});
var User = db.model("user", userScheMa);

const listUser = (ctx, next) => {
  User.find({}, function(err, result) {
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(result);
  });
  // return "listUser";
}
const creatUser = function(ctx, cb) {
  var user = new User(ctx.request.body);
  user.save(function(err, result) {
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(result);
  })
}
module.exports = {
  creatUser,
  listUser
}
