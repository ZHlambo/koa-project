import fs from "fs";
import {getVOO} from "./index"
import {createLog} from "../mysql/models/staff"

Date.prototype.Format = function(fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
        ? (o[k])
        : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//  自定义中间件
module.exports = async function(ctx, next) {
  let {request, response, err} = ctx;
  if (!err) {
    if (request.method !== "GET" && request.url.indexOf("/manage/") != -1 && response.status == 200) {
      createLog({
        ip: request.ip,
        method: request.method,
        body: JSON.stringify(request.body),
        response: JSON.stringify(response.body),
        url: request.header.host + request.url
      }).then(e => {}, e => {
        console.log(e);
        // ctx.send(405, {
        //   msg: getVOO(e, "message")
        // })
      });
    }
  } else { // 请求发生系统错误，记录到txt文件中
    let date = new Date().Format("yyyy-MM-dd hh:mm:ss") + `(${new Date().getTime()})`;
    let str = "url : " + getVOO(request, "header.host") + getVOO(request, "url") + "\n";
    str += "time: " + date + "\n";
    str += "body: " + JSON.stringify(getVOO(request, "body") || {}) + "\n";
    str += "err : " + JSON.stringify(getVOO(response, "body") || {}) + "\n\n";
    fs.appendFile('src/bug.txt', str, function(error) {
      if (error) {
        // 待处理 console.log('写文件操作失败');
      } else {
        // 待处理 console.log('写文件操作成功', str);
      }
    });
  }
  await next();
}
