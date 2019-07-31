import mysql from "../mysql";
import {getId} from "../utils";


module.exports = (koaRouter) => {
  koaRouter.get("/manager/products", (ctx, status, body) => {
    ctx.response.status = 200;
    ctx.response.body = "body";
    return;
  })

  koaRouter.post("/manager/product", async (ctx, status, body) => {
    let data = ctx.request.body;
    // NOTE: 生成product_id
    let product_id = await getId("product");

    let product = await mysql(`INSERT INTO
      product(name, images, descs, status, product_id)
      values
      ('${data.name}', '${data.images}', '${data.descs}', ${data.status || 0},  '${product_id}')`);

    let insertskus = await data.skus.map(async sku => {
      return await mysql(`INSERT INTO
        sku(product_id, standard, quantity)
        values
        ('${product_id}', '${sku.standard.map(e=>`${e.key}:${e.value}`).join(";")}', '${sku.quantity}')`);
    })

    ctx.response.status = 200;
    ctx.response.body = {product_id};
    return;
  })
  koaRouter.get("/manager/product/:id", (ctx, status, body) => {
    ctx.response.status = 200;
    ctx.response.body = "body";
    return;
  })
  koaRouter.delete("/manager/product/:id", (ctx, status, body) => {
    ctx.response.status = 200;
    ctx.response.body = "body";
    return;
  })

  koaRouter.put("/manager/product/:id", (ctx, status, body) => {
    ctx.response.status = 200;
    ctx.response.body = "body";
    return;
  })
};
