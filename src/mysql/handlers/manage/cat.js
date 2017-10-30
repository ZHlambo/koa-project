import cat from "../../models/cat";
import sku from "../../models/sku";

const rootCat = (ctx) => {
  return cat.rootCat(ctx.request.q, ctx)
}

const createCat = (ctx) => {
  return cat.createCat(ctx.request.body || {}, ctx);
}

const getCatChild = (ctx) => {
  return cat.getCatChild(ctx.request.params.id, ctx);
}

const deleteCat = (ctx) => {
  return cat.deleteCat(ctx.request.params.id, ctx);
}

const getCatInfo = (ctx) => {
  return cat.getCatInfo(ctx.request.params.id, ctx);
}

const putCatInfo = (ctx) => {
  return cat.putCatInfo(ctx.request.params.id, ctx.request.body, ctx);
}

const getCatSkus = (ctx) => {
  return sku.getCatSkus(ctx.request.params.id, ctx);
}

module.exports = {
  rootCat,
  getCatChild,
  putCatInfo,
  getCatInfo,
  createCat,
  deleteCat,
  getCatSkus,
}
