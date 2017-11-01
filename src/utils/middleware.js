const jwt = require('jsonwebtoken');

//  自定义中间件
module.exports = async function(ctx, next) {
  let {response, request} = ctx;

  let token = request.header.authorization,
    user;

  /* 定义ctx.send 响应请求  */
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Request-Method', '*');
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,DELETE,PUT,POST');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Content-Type', 'application/json;charset=utf-8');
  ctx.send = function(status, body) {
    ctx.response.status = status;
    ctx.response.body = body;
    return;
  };
  /* 定义ctx.querykey 工具类函数  */
  ctx.querykey = function(id, key) {
    return {
      where: {
        [key]: id
      }
    }
  }
  await next();
}
