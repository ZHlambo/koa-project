import mysql from "../mysql";
import {check, jwtSign, getUuid, getId} from "../utils"

// NOTE: table 表 随机生成 最小是8位数 的ID
export const getOrderNo = async (table) => {
  let result = await mysql(`select id from ${table} order by id DESC limit 1`);
  let year_str = (new Date().getFullYear() + "").substr(2,2);
  let month_str = (Array(2).join(0) + (new Date().getMonth() + 1)).slice(-2);
  let id = result[0] && result[0].id || 1;
  // NOTE: id 至少为4位
  id = id + 1000;
  // NOTE: 4位随机数 补0
  let random_str = (Array(4).join(0) + (Math.random()*10000).toFixed(0)).slice(-4);
  // NOTE: id 前面数字最少两位补0
  let id_str_start = (Array(10).join(0) + Math.floor(id/100)).slice(-10);;
  // NOTE: id 后两位 补0
  let id_str_end = (Array(2).join(0) + id).slice(-2);
  return `${id_str_start}${year_str}${random_str.substr(0,2)}${month_str}${id_str_end}${random_str.substr(2,2)}`;
}


const userRule = {
  name: { max: 20, },
  mobile: { regexp: `^((13[0-9])|(14[0-9])|(15([0-9]))|(166)|(17[0-9])|(18[0-9])|(19[8,9]))\\d{8}$` },
  icon: { regexp: `^http[s]?://.*` },
  password: { regexp: `^[0-9a-zA-Z]{32}$` },
  shop_icon: { regexp: `^http[s]?://.*` },
  shop_name: { max: 20, },
}

module.exports = (koaRouter) => {
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

    let result = await mysql(`select * from user where mobile=${data.mobile}`);
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
  // sku.id,sku.standard,quantity,product_id,product_name,product_images

  // NOTE: 下单
  koaRouter.post("/client/order", async (ctx) => {
    let data = ctx.request.body;
    let temp = {
      s_uuid: {must: true, len: 32},
      skus: {
        must: true,
        type: "array",
        min: 1,
        child: {
          sku_id: {must: true, type: "string"},
          quantity: {must: true, type: "number"},
          // standard: {must: true},
          // product_id: {must: true, type: "number"},
          // product_name: {must: true},
          // product_images: {must: true},
        }
      },
      receive_mobile: { must: true, regexp: `^((13[0-9])|(14[0-9])|(15([0-9]))|(166)|(17[0-9])|(18[0-9])|(19[8,9]))\\d{8}$` },
      receive_address: {must: true},
      note: {max: 100},
    }
    let err = check(data, temp);
    if (err) return ctx.fail(err);

    let spreader = await mysql(`select * from user where uuid='${data.s_uuid}'`);
    if (!spreader || !spreader[0]) return ctx.fail({code: 3001, msg: "传播者不存在"});

    for (let i = 0, sku, product, goods; i < data.skus.length; i++) {
      sku = (await mysql(`select * from sku where id=${data.skus[i].sku_id}`))[0];
      if (!sku) {
        err = {code: 3002, msg: "sku_id不存在"};
        break;
      } else {
        product = (await mysql(`select * from product where product_id='${sku.product_id}'`))[0];
        if (!product) {
          err = {code: 3003, msg: "数据异常，产品product不存在"};
          break;
        } else {
          goods = (await mysql(`select * from goods where product_id='${sku.product_id}' and s_uuid='${data.s_uuid}'`))[0];
          if (!goods) {
            err = {code: 3004, msg: "数据异常，商品goods不存在", product_id: sku.product_id};
            break;
          }
          Object.assign(data.skus[i],{standard: sku.standard, product_id: sku.product_id, product_name: product.name, product_images: product.images});
        }
      }
    }
    if (err) return ctx.fail(err);

    let order_no = await getId("orders");
    let order = await mysql(`INSERT INTO
      orders(s_uuid, skus, receive_mobile, receive_address, note, order_no, status)
      values
      ('${data.s_uuid}', '${JSON.stringify(data.skus)}', '${data.receive_mobile}', '${data.receive_address}', '${data.note || null}', '${order_no}', 10)`)
    ctx.success({...order,order_no_:order_no});
  });


  koaRouter.post("/client/order/pay", async (ctx) => {
    let data = ctx.request.body;
    let order = (await mysql(`select * from orders where order_no='${data.order_no}'`))[0];
    if (!order) {
      ctx.fail({code: 4001, msg: "订单不存在"});
      return ;
    } else if (order.status != 10) {
      ctx.fail({code: 4002, msg: "订单不是未付款状态，不能支付"});
      return ;
    }
    let operateOrder = await mysql(`update orders set status=20 where order_no='${data.order_no}'`);
    ctx.success({msg: "付款成功"});
  });
};
