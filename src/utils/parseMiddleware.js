var jwt = require('jsonwebtoken');

//  自定义中间件
module.exports = async function(ctx, next) {
  let {response, request} = ctx;

  let token = request.header.authorization,
    user;

  /* 解析token并重新赋值给request.data    */
  try {
    user = jwt.verify(token, 'secret');
    ctx.user = user;
  } catch (e) {
    // console.log(e, "catch");
  } finally {
  };

  /* 定义ctx.send 响应请求  */
  // ctx.set('Access-Control-Allow-Origin', '*');
  // ctx.set('Access-Control-Request-Method', '*');
  // ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,DELETE,PUT,POST');
  // ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // ctx.set('Content-Type', 'application/json;charset=utf-8');
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

  // 解析put和post 请求的 body并赋值给request.body
  let body = "";
	ctx.req.addListener("data", (data) => {
		body += data
	})
	ctx.req.addListener("end", function() {
    try {
      request.body = JSON.parse(body);
    } catch (e) {
      ctx.send(500, {msg: e.message});
    } finally {
    }
	})
  await next();
}
