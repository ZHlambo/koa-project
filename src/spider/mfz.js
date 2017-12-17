import http from "http";
import fs from "fs";
import querystring from "querystring";
import request from "../utils/request";
import {
  jwtSign
} from '../utils';

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
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
        (o[k]) :
        (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


let limit = 100;
let postToMysql = (dataSource) => {
  for (var i = 0; i < dataSource.length; i++) {
    let date = new Date().Format("yyyy-MM-dd hh:mm:ss"),
      url = "http://localhost:3000/manage/sku",
      data = {
        name: dataSource[i].name,
        attr: dataSource[i].name,
        catid: 1,
        images: dataSource[i].images,
        price: dataSource[i].price,
        descs: dataSource[i].description
      };
    request.post(url, {
      headers: {
        'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGFtYm8iLCJ0eXBlIjoibWFuYWdlIiwiaWF0IjoxNTEyOTYwMDY4LCJleHAiOjE1MTMwNDY0Njh9.Wo-cpk2htc-m6U20JYbQ4UfhT9R9K48x75t2snlGVLA"
      },
      data
    }).then(body => {
      console.log(body);
    }, err => {
      let str = "地址：" + url + "  " + "时间：" + date + "\n" + "请求：" + JSON.stringify(data) + "\n" + "错误：" + JSON.stringify(err) + "\n\n";
      fs.appendFile('mfz.txt', str, function(error) {
        if (error)
          console.log('写文件操作失败');
        else
          console.log('写文件操作成功', str);
      });
    })
  }
}
let getProducts = (offset) => {
  request.get("https://wx.meifz.com/api/v1/products?q=%7b%22limit%22%3a" + limit + "%2c%22offset%22%3a" + offset + "%7d").then(body => {
    console.log(body.length, typeof body);
    if (body.length == limit) {
      getProducts(offset + limit);
    };
    fs.writeFile('mfz.txt', "", () => {}); // 清空
    postToMysql(body);
  });
}
getProducts(0);
