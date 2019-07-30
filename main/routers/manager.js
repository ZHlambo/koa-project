import mysql from "../mysql";

module.exports = (koaRouter) => {
  koaRouter.get("/manager/products", (ctx, status, body) => {
    ctx.response.status = 200;
    ctx.response.body = "body";
    return;
  })

  koaRouter.post("/manager/product", async (ctx, status, body) => {
    console.log(body, ctx.request.body || {});
    let data = ctx.request.body;
    console.log(mysql);
    let product = await mysql(`INSERT INTO
      product(name, images, descs, status)
      values
      ('${data.name}', '${data.images}', '${data.descs}', '${data.status || 0}')`);
    let productid = product.insertId;
    console.log(`productid=${productid}`);

    let insertStocks = await data.stocks.map(async stock => {
      return await mysql(`INSERT INTO
        stock(productid, standard, quantity)
        values
        ('${productid}', '${stock.standard.map(e=>`${e.key}:${e.value}`).join(";")}', '${stock.quantity}')`);
    })
    console.log(`stocks=${insertStocks}`);
    ctx.response.status = 200;
    ctx.response.body = productid;
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
