import koa from "koa";
import fs from "fs";
import ejs from "ejs";
import Router from "koa-router";
import raml2html from "raml2html";
import parserRaml from "./utils/raml1";
import resolvefiles from "./utils/resolvefiles";
import resolvePath from "./utils/resolvePath";
import bodyParser from "koa-bodyparser";
import parseMiddleware from "./utils/parseMiddleware";
import logMiddleware from "./utils/logMiddleware";
import cors from '@koa/cors';
import {getVOO} from "./utils";

import builder from "api-console-builder";

const port = 3000;

let koaRouter = new Router();

let sendResbond = (ctx, status, body) => {
  ctx.response.status = status;
  ctx.response.body = body;
  return;
}

// 初始化koa
let app = new koa();
app.use(bodyParser());
// 中间件  自定义的中间件
app.use(parseMiddleware);
// 中间件  解决跨域
app.use(cors());

// 配置路由
let types = [
    "client", "manage"
  ],
  handlers = {},
  ramls = {},
  routes;

let typeRouter = (typeRaml, typeHandler, type) => {
  for (let i = 0; i < typeRaml.length; i++) {

    // 解析raml[type]目录下的所有请求route
    routes = parserRaml(typeRaml[i].path).routes();
    for (let route of routes) {
      koaRouter[route.verb]("/" + type + route.uri, async function(ctx, next) {
        /* 解析query并重新赋值给query */
        try {
          ctx.q = JSON.parse(getVOO(ctx.query, "q") || "{}");
          ctx.q.limit = ctx.q.limit > 100 ? 100 : (ctx.q.limit || 10);
          /* 验权 */
          if (route.groupBy == "auth" && (getVOO(ctx, "user.type") != type)) {
            console.log(route.groupBy == "auth", getVOO(ctx, "user.type"));
            return ctx.send(401, {msg: "token无效"});
          }
          /* 缓存验证，有则不再去查询数据库 */
          if (ctx.response.body) {
            return ;
          }
          await typeHandler[typeRaml[i].file][route.handlerFunc](ctx);
        } catch (err) {
          ctx.err = err;
          ctx.send(500, {msg: err.message});
        } finally {}
        next();
        return;
      });
    }

    // api 文档主页
    koaRouter.get("/docs/" + type + "/" + typeRaml[i].file, (ctx, next) => {

      // return builder({dest: 'build', raml: typeRaml[i].path, useJson: true}).then((result) => {
      //   ctx.set('Content-Type', 'text/html;charset=utf-8');
      //   ctx.send(200, result);
      // }).catch((cause) => {
      //   ctx.set('Content-Type', 'text/html;charset=utf-8');
      //   ctx.send(200, cause);
      // });

      // return raml2html.render(typeRaml[i].path, raml2html.getConfigForTheme()).then((result)=>{
      //   console.log("result", 1);
      //   ctx.set('Content-Type', 'text/html;charset=utf-8');
      //   ctx.send(200, result, 1);
      //
      // },(err) =>{
      //   console.log("err");
      //
      // });

      routes = parserRaml(typeRaml[i].path).routes();
      let html = fs.readFileSync(__dirname + "/doc/index.ejs", "utf-8");
      html = ejs.render(html, {
        handlers: routes,
        str: JSON.stringify(routes)
      });
      ctx.set('Content-Type', 'text/html;charset=utf-8');
      ctx.send(200, html, 1);
    });

  }
}

// 解析 handlers 和 raml目录下 types[i] 对应的 api和uri
for (let i = 0; i < types.length; i++) {
  handlers[types[i]] = resolvefiles(`src/mysql/handlers/${types[i]}`);
  ramls[types[i]] = resolvePath(`src/mysql/raml/${types[i]}`);
  typeRouter(ramls[types[i]], handlers[types[i]], types[i]);
}

// api 文档主页
koaRouter.get("/docs", (ctx, next) => {
  let html = fs.readFileSync(__dirname + "/docs/index.ejs", "utf-8");
  html = ejs.render(html, {
    ramls: ramls,
    str: JSON.stringify(ramls),
    __dirname: __dirname
  });
  ctx.set('Content-Type', 'text/html;charset=utf-8');
  ctx.send(200, html);
});

koaRouter.get("/doc/*", (ctx, next) => {
  let file = fs.readFileSync(__dirname + ctx.url, "utf-8");
  ctx.set('Content-Type', /[.css]&/.test(ctx.url) && 'text/css' || 'application/javascript');
  ctx.response.status = 200;
  ctx.response.body = file;
  // if (ctx.url)
});

app.use(koaRouter.routes());

app.use(logMiddleware);

console.log(`server is running in port ${port}`);
app.listen(port);
