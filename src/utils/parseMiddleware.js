var jwt = require('jsonwebtoken');
//  自定义中间件
module.exports = async function(ctx, next) {
  let {response, request} = ctx;

  // 缓存: 使用redis缓存，查询是否有缓存，有则send
  // var Redis = require("ioredis");
  // const REDIS_PORT = 6379;
  //
  // const redis = new Redis({
  //   host: '127.0.0.1', //安装好的redis服务器地址
  //   port: REDIS_PORT, //端口
  //   prefix: 'lambo:', //存诸前缀
  //   ttl: 60 * 60 * 23, //过期时间
  //   db: 0
  // });
  // let result = await ctx.redis.get(ctx.request.url, (err, data)=>{
  //   if (err) throw err;
  // })
  // if (result) {// 有缓存，则使用缓存
  //   ctx.send(200, result);
  // }

  /* token: 解析token并重新赋值给request.data    */
  let token = request.header.authorization,
    user;
  try {
    user = jwt.verify(token, 'secret');
    ctx.user = user;
  } catch (e) {
    // console.log(e, "catch");
  } finally {};

  /* 工具类函数: 定义ctx.send 回包请求  */
  ctx.send = function(status, body) {
    if (typeof body == "string") {
      body = JSON.parse(body);
    } else {  // 缓存: 启用缓存
      // if (request.method == "GET") {
      //   redis.set(request.url, JSON.stringify(body.dataValues || body));
      // }
    }
    response.status = status;
    response.body = body;
    return;
  };

  /* 工具类函数: 定义ctx.querykey  */
  ctx.querykey = function(id, key) {
    return {
      where: {
        [key]: id
      }
    }
  }
  await next();
}
