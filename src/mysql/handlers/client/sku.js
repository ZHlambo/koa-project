import sku from "../../models/sku";

const listSku = (ctx) => {
  return sku.listSku(ctx.request.query, ctx);
}

const getSkuInfo = (ctx) => {
  return sku.getSkuInfo(ctx.request.params.id, ctx);
}

module.exports = {
  listSku,
  getSkuInfo,
}
