import mysql from "../mysql";
import {check, jwtSign, getIdNo} from "../utils"

const goodsRule = {
  product_no: { type: "number" },
}

const spreader = (koaRouter) => {
  // NOTE: 用户上架产品 --> 商品
  koaRouter.post("/spreader/goods", async (ctx) => {
    let data = ctx.request.body;
    var temp = {
      product_no: { must: true, ...goodsRule.product_no},
    }
    let err = check(data, temp);
    if (err) return ctx.fail(err);

    let checkProductId = (await mysql(`select id from product where product_no='${data.product_no}'`))[0];
    if (!checkProductId || !checkProductId.id) {
      return ctx.fail({code: "2001", msg: "产品不存在"});
    }

    // NOTE: // DEBUG: // TODO:
    let user = (await mysql(`select * from user limit 0,1`))[0];
    if (!user || !user.uuid) {
      return  ctx.fail({code: "2002", msg: "用户不存在"});
    }

    let checkGoods = (await mysql(`select * from goods where product_no='${data.product_no}' and s_uuid='${user.uuid}'`))[0];
    if (checkGoods) {
      if (checkGoods.status == 1) {
        return ctx.fail({code: "2002", msg: "您上架该商品了！"});
      } else {
        await mysql(`update goods set status=1 where id='${checkGoods.id}'`);
        return ctx.success({msg: "重新上架商品！"});
      }
    }

    let goods_id = await getIdNo("goods");
    let goods = await mysql(`INSERT INTO
      goods(product_no, s_uuid, status, goods_id)
      values
      ('${data.product_no}', '${user.uuid}', 1, '${goods_id}')`);
    ctx.success({goods_id, s_uuid: user.uuid, status: 1, product_no: data.product_no, msg: "上架商品成功！"});
  });


  koaRouter.get("/spreader/products", async (ctx) => {
    let query = ctx.query || {};
    query.offset = query.offset || 0;
    query.limit = query.limit || 10;
    let where = "p.deletedAt is NULL";
    if (query.name) {
      where += ` and p.name like '%${query.name}%'`
    }
    if (query.status) {
      where += ` and p.status=${query.status}`
    }

    // NOTE: // DEBUG: // TODO:
    let user = (await mysql(`select * from user limit 0,1`))[0];
    if (!user || !user.uuid) {
      return  ctx.fail({code: "2002", msg: "用户不存在"});
    }

    let products = await mysql(`select
      p.*,g.goods_id from product p
      left join goods g on g.product_no=p.product_no and g.s_uuid='${user.uuid}' and g.deletedAt is not null
      where 1=1 and ${where} limit ${query.offset},${query.limit}`);
    let total = (await mysql(`select count(*) as total from product p where ${where}`))[0].total;
    ctx.success({...query, list: products, total});
  });
};


module.exports = spreader;
