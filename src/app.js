const koa = require("koa");
const koaRouter = new require("koa-router")();
const bodyParser = require('koa-bodyparser');
const parserRaml = require('./utils/raml');
const resolvefiles = require('./utils/resolvefiles');
const resolvePath = require('./utils/resolvePath');
const middleware = require('./utils/middleware');
const port = 3000;

var sendResbond = (ctx,status,body) => {
  ctx.response.status = status;
  ctx.response.body = body;
  return ;
}

// 初始化koa
let app = new koa();
// 中间件  使用解析ctx.body的中间件
app.use(bodyParser());
// 中间件  自定义的中间件
app.use(middleware);

// 配置路由
let types = ["client", "manage"],
  handlers = {},
  ramls = {},
  routes;
for (let i = 0; i < types.length; i++) {
  // 解析handlers目录下的所有方法
  handlers[types[i]] = resolvefiles(`src/mysql/handlers/${types[i]}`);
  // 解析raml[types[i]]目录下的所有uri
  ramls[types[i]] = resolvePath(`src/mysql/raml/${types[i]}`);
  for (let j = 0; j < ramls[types[i]].length; j++) {
    // 解析raml[types[i]]目录下的所有请求route
    routes = parserRaml(ramls[types[i]][j].path).routes();
    for (let route of routes) {
      koaRouter[route.verb]("/" + types[i] + route.uri, async function(ctx, next) {
        let {response, request} = ctx;
        /* 验权 */
        if (route.groupBy == "auth" && (!request.data || request.data.type != types[i])) {
          return ctx.send(401,{msg: "token无效"});
        }
        request.params = ctx.params;
        try {
          return await handlers[types[i]][ramls[types[i]][j].file][route.handlerFunc](ctx)
        } catch (err) {
          console.log(err);
          ctx.send(500,{
            msg: err.message
          });
          return;
        } finally {}
      });

    }
  }
}

app.use(koaRouter.routes());

app.listen(port);
