import mysql from "../../mysql";
import {check, jwtSign, getUuid, getIdNo} from "../../utils"
import orderRouter from "./order";

const userRule = {
  name: { max: 20, },
  mobile: { regexp: `^((13[0-9])|(14[0-9])|(15([0-9]))|(166)|(17[0-9])|(18[0-9])|(19[8,9]))\\d{8}$` },
  icon: { regexp: `^http[s]?://.*` },
  password: { regexp: `^[0-9a-zA-Z]{32}$` },
  shop_icon: { regexp: `^http[s]?://.*` },
  shop_name: { max: 20, },
}

module.exports = (koaRouter) => {
  orderRouter(koaRouter);

  koaRouter.get("/client/user", (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = "body";
    return;
  })
  // NOTE: 创建用户
  koaRouter.post("/client/user", async (ctx) => {
    let data = ctx.request.body;

    var temp = {
      name: { must: true, ...userRule.name},
      mobile: { must: true, ...userRule.mobile},
      icon: { must: true, ...userRule.icon},
      password: { must: true, ...userRule.password }
    }
    let err = check(data, temp);
    if (err) return ctx.fail(err);

    // NOTE: 检验手机号码是否已注册
    let checkMobile = await mysql(`select * from user where mobile=${data.mobile}`);
    if (checkMobile && checkMobile[0] && checkMobile[0].id) {
      return ctx.fail({code: 1004, msg: "账户已注册"});
    }

    let uuid = await getUuid();
    let result = await mysql(`INSERT INTO
      user(name, mobile, icon, password, uuid)
      values
      ('${data.name}', '${data.mobile}', '${data.icon}', '${data.password}', '${uuid}')`);

    let user = {uuid};
    user.token = jwtSign({uuid, type: "client" });
    // console.log(`userid=${user.id}`);
    ctx.success(user);
  })

  koaRouter.post("/client/user/login/mobile", async (ctx) => {
    let data = ctx.request.body;

    var temp = {
      mobile: { must: true, ...userRule.mobile},
      password: { must: true, ...userRule.password }
    }
    let err = check(data, temp);
    if (err) return ctx.fail(err);

    let result = await mysql(`select * from user where mobile='${data.mobile}'`);
    result = result[0];
    if (result && result.id) {
      if (result.password === data.password) {
        let user = result;
        user.token = jwtSign({ id: user.id, type: "client" });
        return ctx.success(user);
      } else {
        return ctx.fail({code: 1003, msg: "密码错误"});
      }
    } else {
      return ctx.fail({code: 1002, msg: "账号未注册"});
    }
  });
  // NOTE: 修改用户
  koaRouter.put("/client/user/info", async (ctx) => {
    // NOTE: mobile = 2 // TODO:
    let data = ctx.request.body;
    let sql = await mysql(`update user set `)
    var temp = {
      ...userRule,
      mobile: undefined,
    }
    let err = check(data, temp);
    if (err) return ctx.fail(err);
  });
  // sku.id,sku.standard,quantity,product_no,product_name,product_images
  koaRouter.get("/client/orders", async (ctx) => {
    let orders = await mysql(`select * from orders LIMIT 0,10`);
    ctx.success(orders);
  });
};
