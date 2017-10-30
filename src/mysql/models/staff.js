import {jwtSign} from '../../utils';

const staffLogin = async(body, cb) => {
  if (body.name === "lambo" && body.password === "dord") {
    return cb(200, {
      token: jwtSign({name: body.name, type: "manage"})
    });
  } else {
    cb(400, {msg: "账户或者密码错误"});
  }
}

module.exports = {
  staffLogin
}
