import mysql from "../mysql";
import {getIdNo, check} from "../utils";


module.exports = (koaRouter) => {
  koaRouter.get("/merchant/products", (ctx, status, body) => {
    ctx.response.status = 200;
    ctx.response.body = "body";
    return;
  })

  koaRouter.post("/merchant/product", async (ctx, status, body) => {
    let data = ctx.request.body;
    // NOTE: 生成product_no
    let product_no = await getIdNo("product");

    let product = await mysql(`INSERT INTO
      product(name, images, descs, status, product_no)
      values
      ('${data.name}', '${data.images}', '${data.descs}', ${data.status || 0},  '${product_no}')`);

    let insertskus = await data.skus.map(async sku => {
      return await mysql(`INSERT INTO
        sku(product_no, standard, quantity)
        values
        ('${product_no}', '${sku.standard.map(e=>`${e.key}:${e.value}`).join(";")}', '${sku.quantity}')`);
    })

    ctx.response.status = 200;
    ctx.response.body = {product_no};
    return;
  })
  koaRouter.get("/merchant/product/:id", (ctx, status, body) => {
    ctx.response.status = 200;
    ctx.response.body = "body";
    return;
  })
  koaRouter.delete("/merchant/product/:id", (ctx, status, body) => {
    ctx.response.status = 200;
    ctx.response.body = "body";
    return;
  })

  koaRouter.put("/merchant/product/:id", (ctx, status, body) => {
    ctx.response.status = 200;
    ctx.response.body = "body";
    return;
  })

  const checkOrder = async (ctx, operation) => {
    let order_no = ctx.params.order_no;
    let data = ctx.request.body;

    if (ctx.request.body.next) {
      await mysql(`update orders set status=${ctx.request.body.next} where order_no='${order_no}'`);
    }
    let order = (await mysql(`select * from orders where order_no='${order_no}' LIMIT 0,1`))[0];
    if (!order) {
      ctx.fail({code: 4001, msg: "订单不存在"});
      return ;
    } else if (operation.current.indexOf(order.status + "") == -1) {
      ctx.fail({code: 4002, msg: operation.err});
      return ;
    }
    return order;
  }

  // NOTE: send
  koaRouter.post(`/merchant/order/:order_no/send`, async (ctx) => {
    let result = await checkOrder(ctx, {current: "20,21,30", err: "订单当前状态不能发货"});
    let order_no = ctx.params.order_no;
    if (!result) return ;

    let data = ctx.request.body || {};
    let temp = {
      carrier_no: {must: true, max: 30},
      carrier_compony: {must: true, max: 10},
      carrier_compony_no: {must: true, max: 10},
    };
    let err = check(data, temp);
    if (err) return ctx.fail(err);

    let updateSql = `carrier_no='${data.carrier_no}',carrier_compony='${data.carrier_compony}',carrier_compony_no='${data.carrier_compony_no}'`;

    let order_history = result.order_history || [];
    order_history.push({name: "merchant", data, status: 30, createdAt: new Date().getTime()})
    let operateOrder = await mysql(`update orders set status=30,order_history='${JSON.stringify(order_history)}',${updateSql} where order_no='${order_no}'`);
    ctx.success({msg: "发货成功"});
  });

  // NOTE: refund/agree
  koaRouter.post(`/merchant/order/:order_no/refund/agree`, async (ctx) => {
    let result = await checkOrder(ctx, {current: "21", err: "该订单不能操作确认退款"});
    let order_no = ctx.params.order_no;
    if (!result) return ;

    let order_history = result.order_history || [];
    order_history.push({name: "merchant", data: {}, status: 51, createdAt: new Date().getTime()})
    let operateOrder = await mysql(`update orders set status=51,order_history='${JSON.stringify(order_history)}' where order_no='${order_no}'`);
    ctx.success({msg: "同意退款，操作成功"});
  });

  // NOTE: return/agree
  koaRouter.post(`/merchant/order/:order_no/return/agree`, async (ctx) => {
    let result = await checkOrder(ctx, {current: "31,32", err: "该订单不能操作确认退货"});
    let order_no = ctx.params.order_no;
    if (!result) return ;

    let order_history = result.order_history || [];
    order_history.push({name: "merchant", data: {}, status: 52, createdAt: new Date().getTime()})
    let operateOrder = await mysql(`update orders set status=52,order_history='${JSON.stringify(order_history)}' where order_no='${order_no}'`);
    ctx.success({msg: "同意退货，操作成功"});
  });
};
