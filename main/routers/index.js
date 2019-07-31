import Router from "koa-router";
import managerRouter from "./manager";
import clientRouter from "./client";
import spreaderRouter from "./spreader";

var koaRouter = new Router();
const middle = async function (func, params) {
  let ctx = params[0];
  try {
    ctx.set('Content-Type', 'application/json');
    ctx.success = (data, status) => {
      ctx.response.status = status || 200;
      ctx.response.body = JSON.stringify({
        code: 0,
        result: data,
      });
    }
    ctx.fail = (err, status) => {
      ctx.response.status = status || 200;
      ctx.response.body = JSON.stringify(err);
    }
    await func(...params);
  } catch (e) {
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify({msg: "系统出错", err: e.stack});
    return ;
  }
}
var router = {
  get: (url, func) => {
    return koaRouter.get(url, async function () {
      await middle(func, arguments);
    });
  },
  post: (url, func) => {
    return koaRouter.post(url, async function () {
      await middle(func, arguments);
    });
  },
  put: (url, func) => {
    return koaRouter.put(url, async function () {
      await middle(func, arguments);
    });
  },
  delete: (url, func) => {
    return koaRouter.delete(url, async function () {
      await middle(func, arguments);
    });
  },
}
managerRouter(router);
clientRouter(router);
spreaderRouter(router);

module.exports = koaRouter.routes();
