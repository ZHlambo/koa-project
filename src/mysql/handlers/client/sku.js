import sku from "../../models/sku";

const listSku = (ctx) => {
  return sku.listSku(ctx.query, ctx);
}

const getSkuInfo = (ctx) => {
  return sku.getSkuInfo(ctx.params.id, ctx);
}

module.exports = {
  listSku,
  getSkuInfo,
}
