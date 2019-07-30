import koa from "koa";
import fs from "fs";
import bodyParser from "koa-bodyparser";
// import parseMiddleware from "./utils/parseMiddleware";
// import logMiddleware from "./utils/logMiddleware";
import cors from '@koa/cors';
import routers from "./routers";
const port = 8000;

let sendResbond = (ctx, status, body) => {
  ctx.response.status = 200;
  ctx.response.body = "body";
  return ctx;
}

// 初始化koa
let app = new koa();
app.use(bodyParser());
// 中间件  自定义的中间件
// app.use(parseMiddleware);
// 中间件  解决跨域
app.use(cors());

app.use(routers);

// app.use(logMiddleware);

console.log(`server is running in port ${port}`);
app.listen(port);
