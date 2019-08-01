import mysql from "../../mysql";
import {getId, check} from "../../utils";
import orderRouter from "./order";

const productRule = {
  name: {min: 5, max: 100},
  images: {},
  descs: {},
  skus: {
    min: 1,
    type: "array",
    child: {
      quantity: {must: true, type: "number", regexp: "^[1-9]{1}[0-9]*$"},
      standard: {
        must: true,
        min: 1,
        type: "array",
        child: {
          key: {must: true},
          value: {must: true},
        }
      },
    }
  }
};

module.exports = (koaRouter) => {
  orderRouter(koaRouter);

  koaRouter.get("/merchant/products", (ctx, status, body) => {
    ctx.response.status = 200;
    ctx.response.body = "body";
    return;
  })

  koaRouter.post("/merchant/product", async (ctx, status, body) => {
    let data = ctx.request.body || {};
    let temp = {
      name: {must: true, ...productRule.name},
      images: {must: true, ...productRule.images},
      descs: {must: true, ...productRule.descs},
      skus: {must: true, ...productRule.skus},
    };
    let err = check(data, temp);
    if (err) return ctx.fail(err);

    // NOTE: 生成product_id
    let product_id = await getId("product");

    let product = await mysql(`INSERT INTO
      product(name, images, descs, status, product_id)
      values
      ('${data.name}', '${data.images}', '${data.descs}', ${data.status || 0},  '${product_id}')`);

    let insertskus = await data.skus.map(async sku => {
      return await mysql(`INSERT INTO
        sku(product_id, standard, quantity, saled)
        values
        ('${product_id}', '${sku.standard.map(e=>`${e.key}:${e.value}`).join(";")}', '${sku.quantity}', 0)`);
    })

    ctx.response.status = 200;
    ctx.response.body = {product_id};
    return;
  })

  koaRouter.get("/merchant/product/:product_id", async (ctx, status, body) => {
    let product_id = ctx.params.product_id;
    let product = (await mysql(`select * from product where product_id='${product_id}' LIMIT 0,1`))[0];
    if (!product) {
      ctx.fail({code: 5001, msg: "产品不存在"});
      return ;
    }
    ctx.success(product);
  })

  koaRouter.delete("/merchant/product/:product_id", async (ctx, status, body) => {
    let product_id = ctx.params.product_id;
    let product = (await mysql(`select * from product where product_id='${product_id}' LIMIT 0,1`))[0];
    if (!product) {
      ctx.fail({code: 5001, msg: "产品不存在"});
      return ;
    }
    let operateProduct = mysql(`update set deletedAt='${new Date()}' from product where product_id='${product_id}'`)
    return;
  })

  koaRouter.put("/merchant/product/:product_id", async (ctx, status, body) => {
    let product_id = ctx.params.product_id;
    let product = (await mysql(`select * from product where product_id='${product_id}' LIMIT 0,1`))[0];
    if (!product) {
      ctx.fail({code: 5001, msg: "产品不存在"});
      return ;
    }
    let data = ctx.request.body || {};

    let temp = {
      name: {...productRule.name},
      images: {...productRule.images},
      descs: {...productRule.descs},
      skus: {...productRule.skus},
    };
    let err = check(data, temp);
    if (err) return ctx.fail(err);

    let updateSql = "";
    if (data.name) {
      updateSql += `,name='${data.name}'`;
    }
    if (data.images) {
      updateSql += `,images='${data.images}'`;
    }
    if (data.descs) {
      updateSql += `,descs='${data.descs}'`;
    }
    if (updateSql) {
      await mysql(`update set ${updateSql.replace(",", "")} from product where product_id='${product_id}'`)
    }

    let skus = await mysql(`select * from sku where product_id=${product_id}`);

    // let product = await mysql(`INSERT INTO
    //   product(name, images, descs, status, product_id)
    //   values
    //   ('${data.name}', '${data.images}', '${data.descs}', ${data.status || 0},  '${product_id}')`);
    //
    // let insertskus = await data.skus.map(async sku => {
    //   return await mysql(`INSERT INTO
    //     sku(product_id, standard, quantity, saled)
    //     values
    //     ('${product_id}', '${sku.standard.map(e=>`${e.key}:${e.value}`).join(";")}', '${sku.quantity}', 0)`);
    // })

    ctx.success(product);
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
};
