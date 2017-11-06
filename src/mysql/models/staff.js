import {jwtSign} from '../../utils';

const staffLogin = async(body, ctx) => {
  if (body.name === "lambo" && body.password === "dord") {
    console.log(body.name);
    let token = await jwtSign({name: body.name, type: "manage"});
    return ctx.send(200, {
      token
    });
  } else {
    ctx.send(400, {msg: "账户或者密码错误"});
  }
}

module.exports = {
  staffLogin
}
