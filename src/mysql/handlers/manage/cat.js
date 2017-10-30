import cat from "../../models/cat";
import sku from "../../models/sku";

const rootCat = (req, cb) => {
  return cat.rootCat(req.q, cb)
}

const createCat = (req, cb) => {
  return cat.createCat(req.body || {}, cb);
}

const getCatChild = (req, cb) => {
  return cat.getCatChild(req.params.id, cb);
}

const deleteCat = (req, cb) => {
  return cat.deleteCat(req.params.id, cb);
}

const getCatInfo = (req, cb) => {
  return cat.getCatInfo(req.params.id, cb);
}

const putCatInfo = (req, cb) => {
  return cat.putCatInfo(req.params.id, req.body, cb);
}

const getCatSkus = (req, cb) => {
  return sku.getCatSkus(req.params.id, cb);
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
