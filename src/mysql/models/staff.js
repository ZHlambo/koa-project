import {jwtSign} from '../../utils';

const staffLogin = async(body, ctx) => {
  if (body.name === "lambo" && body.password === "dord") {
    return ctx.send(200, {
      token: jwtSign({name: body.name, type: "manage"})
    });
  } else {
    ctx.send(400, {msg: "账户或者密码错误"});
  }
}

module.exports = {
  staffLogin
}
