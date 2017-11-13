import cat from "../../models/cat";
import sku from "../../models/sku";

const rootCat = (ctx) => {
  return cat.rootCat(ctx.query, ctx)
}

const createCat = (ctx) => {
  return cat.createCat(ctx.request.body || {}, ctx);
}

const getCatChild = (ctx) => {
  return cat.getCatChild(ctx.params.id, ctx);
}

const deleteCat = (ctx) => {
  return cat.deleteCat(ctx.params.id, ctx);
}

const getCatInfo = (ctx) => {
  return cat.getCatInfo(ctx.params.id, ctx);
}

const putCatInfo = (ctx) => {
  console.log(ctx.request);
  return cat.putCatInfo(ctx.params.id, ctx.request.body, ctx);
}

const getCatSkus = (ctx) => {
  return sku.getCatSkus(ctx.params.id, ctx);
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
