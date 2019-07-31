import mysql from "../mysql";
import {check, jwtSign, getId} from "../utils"

const goodsRule = {
  product_id: { type: "number" },
}

module.exports = (koaRouter) => {
  // NOTE: 用户上架产品 --> 商品
  koaRouter.post("/spreader/goods", async (ctx) => {
    let data = ctx.request.body;
    var temp = {
      product_id: { must: true, ...goodsRule.product_id},
    }
    let err = check(data, temp);
    if (err) return ctx.fail(err);

    // NOTE: // DEBUG: // TODO:
    let user = await mysql(`select * from user limit 0,1`);
    user = user[0];

    let checkProductId = await mysql(`select id from product where product_id='${data.product_id}'`);
    if (!checkProductId || !checkProductId[0] || !checkProductId[0].id) {
      return ctx.fail({code: "2001", msg: "产品不存在"});
    }


    if (user && user.uuid) {
      let goods_id = await getId("goods");
      let goods = await mysql(`INSERT INTO
        goods(product_id, s_uuid, status, goods_id)
        values
        ('${data.product_id}', '${user.uuid}', 1, '${goods_id}')`);
      ctx.success({goods_id, s_uuid: user.uuid, status: 1, product_id: data.product_id});
    } else {
      ctx.fail({code: "2002", msg: "用户不存在"});
    }
  });
};
