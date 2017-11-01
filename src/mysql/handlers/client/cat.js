import cat from "../../models/cat";
import sku from "../../models/sku";

const rootCat = (ctx) => {
  return cat.rootCat(ctx.query, ctx)
}

const getCatChild = (ctx) => {
  return cat.getCatChild(ctx.params.id, ctx);
}

const getCatSkus = (ctx) => {
  return sku.getCatSkus(ctx.params.id, ctx);
}

module.exports = {
  rootCat,
  getCatChild,
  getCatSkus,
}
