import cat from "../../models/cat";
import sku from "../../models/sku";

const rootCat = (req, cb) => {
  return cat.rootCat(req.q, cb)
}

const getCatChild = (req, cb) => {
  return cat.getCatChild(req.params.id, cb);
}

const getCatSkus = (req, cb) => {
  return sku.getCatSkus(req.params.id, cb);
}

module.exports = {
  rootCat,
  getCatChild,
  getCatSkus,
}
