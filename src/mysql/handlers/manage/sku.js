const sku = require("../../models/sku");

const listSku = (ctx) => {
  return sku.listSku(ctx.request.query, ctx)
}
const createSku = (ctx) => {
  return sku.createSku(ctx.request.body, ctx);
}

const deleteSku = (ctx) => {
  return sku.deleteSku(ctx.request.params.id, ctx);
}

const getSkuInfo = (ctx) => {
  return sku.getSkuInfo(ctx.request.params.id, ctx);
}

const putSkuInfo = (ctx) => {
  return sku.putSkuInfo(ctx.request.params.id, ctx.request.body, ctx);
}

module.exports = {
  listSku,
  putSkuInfo,
  getSkuInfo,
  createSku,
  deleteSku
}
