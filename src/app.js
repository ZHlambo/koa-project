import koa from "koa";
import fs from "fs";
import ejs from "ejs";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import raml2html from "raml2html";
import parserRaml from "./utils/raml1";
import resolvefiles from "./utils/resolvefiles";
import resolvePath from "./utils/resolvePath";
import middleware from "./utils/middleware";
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
// 中间件  使用解析ctx.body的中间件
app.use(bodyParser());
// 中间件  自定义的中间件
app.use(middleware);

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
        ctx.query = JSON.parse(getVOO(ctx, "request.query.q") || "{}");
        /* 验权 */
        if (route.groupBy == "auth" && (getVOO(ctx, "user.type") != type)) {
          console.log(route.groupBy == "auth", getVOO(ctx, "user.type"));
          return ctx.send(401, {msg: "token无效"});
        }
        try {
          return await typeHandler[typeRaml[i].file][route.handlerFunc](ctx)
        } catch (err) {
          console.log(err);
          ctx.send(500, {msg: err.message});
          return;
        } finally {}
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
      return raml2html.render(typeRaml[i].path, raml2html.getConfigForTheme()).then((result)=>{
        console.log("result");
        ctx.set('Content-Type', 'text/html;charset=utf-8');
        ctx.send(200, result);

      },(err) =>{
        console.log("err");

      });
      routes = parserRaml(typeRaml[i].path).routes();
      let html = fs.readFileSync(__dirname + "/docs/main.ejs", "utf-8");
      html = ejs.render(html, {handlers: routes, str: JSON.stringify(routes)});
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
  html = ejs.render(html, {ramls: ramls,str:JSON.stringify(ramls),__dirname:__dirname});
  ctx.set('Content-Type', 'text/html;charset=utf-8');
  ctx.send(200, html);
});

app.use(koaRouter.routes());

app.listen(port);
