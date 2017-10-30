import cat from "../../models/cat";
import sku from "../../models/sku";

const rootCat = (ctx) => {
  return cat.rootCat(ctx.request.q, ctx)
}

const getCatChild = (ctx) => {
  return cat.getCatChild(ctx.request.params.id, ctx);
}

const getCatSkus = (ctx) => {
  return sku.getCatSkus(ctx.request.params.id, ctx);
}

module.exports = {
  rootCat,
  getCatChild,
  getCatSkus,
}
