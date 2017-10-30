const sku = require("../../models/sku");

const listSku = (req, cb) => {
  return sku.listSku(req.query, cb)
}
const createSku = (req, cb) => {
  return sku.createSku(req.body, cb);
}

const deleteSku = (req, cb) => {
  return sku.deleteSku(req.params.id, cb);
}

const getSkuInfo = (req, cb) => {
  return sku.getSkuInfo(req.params.id, cb);
}

const putSkuInfo = (req, cb) => {
  return sku.putSkuInfo(req.params.id, req.body, cb);
}

module.exports = {
  listSku,
  putSkuInfo,
  getSkuInfo,
  createSku,
  deleteSku
}
