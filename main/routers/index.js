import Router from "koa-router";
import managerRouter from "./manager";
import clientRouter from "./client";

var koaRouter = new Router();
const middle = async function (func, params) {
  try {
    params[0].set('Content-Type', 'application/json');
    await func(...params);
  } catch (e) {
    let ctx = params[0];
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify({msg: "系统出错", err: e.toString()});
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

module.exports = koaRouter.routes();
