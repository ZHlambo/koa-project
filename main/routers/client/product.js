import mysql from "../../mysql";
import {getIdNo, check} from "../../utils";


const productRule = {
  name: {min: 5, max: 100},
  images: {},
  descs: {},
  skus: {
    min: 1,
    type: "array",
    child: {
      quantity: {must: true, type: "number", regexp: "^[1-9]{1}[0-9]*$"},
      standard: {
        must: true,
        min: 1,
        type: "array",
        child: {
          key: {must: true},
          value: {must: true},
        }
      },
    }
  }
};

module.exports =  (koaRouter) => {
  koaRouter.get("/client/products", async ctx => {
    let query = ctx.query || {};
    query.offset = query.offset || 0;
    query.limit = query.limit || 10;
    let where = "deletedAt is NULL";
    if (query.name) {
      where += ` and name like '%${query.name}%'`
    }
    if (query.status) {
      where += ` and status=${query.status}`
    }

    let products = await mysql(`select * from product where ${where} limit ${query.offset},${query.limit}`);
    let total = (await mysql(`select count(*) as total from product where ${where}`))[0].total;
    ctx.success({...query, list: products, total});
  });

  koaRouter.get("/client/product/:product_no", async ctx => {
    let product_no = ctx.params.product_no;
    let product = (await mysql(`select * from product where product_no='${product_no}' LIMIT 0,1`))[0];
    if (!product) {
      ctx.fail({code: 5001, msg: "产品不存在"});
      return ;
    }
    let skus = (await mysql(`select * from sku where product_no='${product_no}'`));
    ctx.success({...product,skus});
  })

  koaRouter.delete("/client/product/:product_no", async ctx => {
    let product_no = ctx.params.product_no;
    let product = (await mysql(`select * from product where product_no='${product_no}' LIMIT 0,1`))[0];
    if (!product) {
      ctx.fail({code: 5001, msg: "产品不存在"});
      return ;
    }
    let operateProduct = await mysql(`update product set deletedAt='${ctx.utils.formatDate(new Date())}' where product_no='${product_no}'`)
    ctx.success({msg: "删除产品成功"});
    return;
  })

  koaRouter.put("/client/product/:product_no", async ctx => {
    let product_no = ctx.params.product_no;
    let product = (await mysql(`select * from product where product_no='${product_no}' LIMIT 0,1`))[0];
    if (!product) {
      ctx.fail({code: 5001, msg: "产品不存在"});
      return ;
    }
    let data = ctx.request.body || {};

    let temp = {
      name: {...productRule.name},
      images: {...productRule.images},
      descs: {...productRule.descs},
      skus: {...productRule.skus},
    };
    let err = check(data, temp);
    if (err) return ctx.fail(err);

    let updateSql = "";
    if (data.name) {
      updateSql += `,name='${data.name}'`;
    }
    if (data.images) {
      updateSql += `,images='${data.images}'`;
    }
    if (data.descs) {
      updateSql += `,descs='${data.descs}'`;
    }
    if (updateSql) {
      await mysql(`update product set ${updateSql.replace(",", "")} where product_no='${product_no}'`)
    }

    if (!data.skus) {
      return ;
    }
    data.skus.forEach(sku => sku.standard = sku.standard.map(e=>`${e.key}:${e.value}`).join(";"));

    // NOTE: 更新删除新增sku  查询出当前有效sku；
    let skus = await mysql(`select * from sku where product_no=${product_no} and deletedAt is NULL`);
    // TODO: quantity and saled 必须必原来的大；
    let index = "";
    skus.forEach(sku => {
      index = data.skus.findIndex(e => e.standard === sku.standard);
      if (index == -1) {
        sku.del = true;
      } else {
         data.skus[index].has = true;
        Object.assign(sku, data.skus[index]);
      }
    });
    let delSkus = skus.filter(sku => sku.del).map(sku => sku.id);
    let updateSkus = skus.filter(sku => !sku.del);
    let featSkus = data.skus.filter(sku => !sku.has);

    let date = ctx.utils.formatDate(new Date());
    let delSkusSql = await delSkus.map(async sku => {
      return await mysql(`update sku set deletedAt='${date}' where id=${sku.id}`);
    });
    let updateSkusSql = await updateSkus.map(async sku => {
      return await mysql(`update sku set quantity=${sku.quantity},saled=${sku.saled} where id=${sku.id}`);
    });
    let featSkusSql = await featSkus.map(async sku => {
      return await mysql(`INSERT INTO
        sku(product_no, standard, quantity, saled)
        values
        ('${product_no}', '${sku.standard}', '${sku.quantity}', 0)`);
    })

    ctx.success({product, delSkusSql, featSkus, updateSkus});
  });
};
