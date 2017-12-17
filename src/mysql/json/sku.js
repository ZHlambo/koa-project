module.exports = {
  createSku: {
    name: {
      type: "string",
      content: "name"
    },
    attr: {
      type: "string",
      content: "red"
    },
    catid: {
      type: "number",
      content: 1
    },
    images: {
      type: "string",
      content: "http://www.baidu.com/images"
    },
    price: {
      type: "number",
      content: 0.12
    },
    descs: {
      type: "string",
      content: "this is sku descs"
    }
  },
  putSkuInfo: {
    name: {
      type: "string",
      content: "name"
    },
    catid: {
      type: "number",
      content: 1
    },
    attr: {
      type: "string",
      content: "red"
    },
    images: {
      type: "string",
      content: "http://www.baidu.com/images"
    },
    price: {
      type: "number",
      content: 0.12
    },
    descs: {
      type: "string",
      content: "this is sku descs"
    }
  },
  putSkuCat: {
    catid: {
      type: "number",
      content: 1
    }
  }
}
