const sku = require("../../models/sku");

const listSku = (ctx) => {
  return sku.listSku(ctx.q, ctx)
}
const createSku = (ctx) => {
  return sku.createSku(ctx.request.body, ctx);
}

const deleteSku = (ctx) => {
  return sku.deleteSku(ctx.params.id, ctx);
}

const getSkuInfo = (ctx) => {
  return sku.getSkuInfo(ctx.params.id, ctx);
}

const putSkuInfo = (ctx) => {
  return sku.putSkuInfo(ctx.params.id, ctx.request.body, ctx);
}

module.exports = {
  listSku,
  putSkuInfo,
  getSkuInfo,
  createSku,
  deleteSku
}
