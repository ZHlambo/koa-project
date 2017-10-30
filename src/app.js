const koa = require("koa");
const koaRouter = new require("koa-router")();
const bodyParser = require('koa-bodyparser');
const parserRaml = require('./utils/raml');
const resolvefiles = require('./utils/resolvefiles');
const resolvePath = require('./utils/resolvePath');
const jwt = require('jsonwebtoken');
const port = 3000;

// 初始化koa
let app = new koa();
// 使用解析ctx.body的中间件
app.use(bodyParser());
// 解析token
function parseToken(ctx,type) {
  let token = ctx.request.header.authorization,
    user;
  try {
    user = jwt.verify(token, 'secret');
    ctx.request.data = user;
    // console.log(user);
    if(user.type != type) throw {};
  } catch (e) {
    // console.log(e);
    ctx.response.status = 401;
    ctx.response.body = {
      msg: "token无效"
    };
    return;
  } finally {}
  return user;
}

// 配置路由
let handlers = {},
  ramls = {},
  routes;
let types = ["client", "manage"];
for (let i = 0; i < types.length; i++) {
  // 解析handlers目录下的所有方法
  handlers[types[i]] = resolvefiles(`src/mysql/handlers/${types[i]}`);
  // 解析raml[types[i]]目录下的所有uri
  ramls[types[i]] = resolvePath(`src/mysql/raml/${types[i]}`);
  for (let j = 0; j < ramls[types[i]].length; j++) {
    // 解析raml[types[i]]目录下的所有请求route
    routes = parserRaml(ramls[types[i]][j].path).routes();
    for (let route of routes) {
      koaRouter[route.verb]("/" + types[i] + route.uri, function(ctx, next) {
        /*    解析query并重新赋值给req.query    */
        let {response, request} = ctx;
        request.params = ctx.params;
        if (request.query) {
          request.q = JSON.parse(request.query.q || "{}")
        };
        /*    解析token并重新赋值给req.data    */
        if (route.groupBy == "auth") {
          if (!parseToken(ctx,types[i])) {
            return;
          }
        }
        return handlers[types[i]][ramls[types[i]][j].file][route.handlerFunc](request, (code, result, next) => {
          ctx.set('Access-Control-Allow-Origin', '*');
          ctx.set('Access-Control-Request-Method', '*');
          ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,DELETE,PUT,POST');
          ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
          ctx.set('Content-Type', 'application/json;charset=utf-8');
          response.status = code;
          response.body = result;
        })
      });

    }
  }
}

app.use(koaRouter.routes());

app.listen(port);
