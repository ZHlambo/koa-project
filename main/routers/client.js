import mysql from "../mysql";
import {check} from "../utils"

module.exports = (koaRouter) => {
  koaRouter.get("/client/user", (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = "body";
    return;
  })

  koaRouter.post("/client/user", async (ctx) => {
    let data = ctx.request.body;

    var temp = {
      name: { must: true, len: 20, },
      mobile: { must: true, regexp: `^((13[0-9])|(14[0-9])|(15([0-9]))|(166)|(17[0-9])|(18[0-9])|(19[8,9]))\\d{8}$` },
      icon: { must: true, regexp: `^http[s]?://.*` },
      password: { must: true, regexp: `^[0-9a-zA-Z]{32}$` }
    }
    let err = check(data, temp);
    if (err) {
      ctx.response.status = 200;
      ctx.response.body = JSON.stringify({msg: err[0].msg, err});
      return ;
    }
    ctx.response.status = 200;
    ctx.response.body = "xxxx";
    return ;
  })
};
