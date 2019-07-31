const request = require("request");
const md5 = require("md5");
const host = "http://localhost:8000";
//
// (async function () {
//   await request({
//     url: `${host}/manager/product`,
//     method: "POST",
//     body: JSON.stringify({
//       name: "商品名",
//       images: "http://static.d.intbee.com/FgsRkZVilAzM9bqVz0q7C390bpMu;http://static.d.intbee.com/FgsRkZVilAzM9bqVz0q7C390bpMu;http://static.d.intbee.com/FgsRkZVilAzM9bqVz0q7C390bpMu",
//       descs: "描述",
//       skus: [
//         {"standard": [{"key":"颜色","value":"白色"},{"key":"尺寸","value":10}], "quantity": 10, },
//         {"standard": [{"key":"颜色","value":"白色1"},{"key":"尺寸","value":101}], "quantity": 101, },
//         {"standard": [{"key":"颜色","value":"白色2"},{"key":"尺寸","value":102}], "quantity": 102, },
//         {"standard": [{"key":"颜色","value":"白色3"},{"key":"尺寸","value":103}], "quantity": 103, },
//       ]
//     }),
//     headers: {
//       "content-type": "application/json"
//     }
//   }, (error, response, body) => {
//     if (!error && response.statusCode == 200) {
//       console.log(body) // Show the HTML for the baidu homepage.
//     }
//   });
// })();
(async function () {
  await request({
    url: `${host}/client/user`,
    method: "POST",
    body: JSON.stringify({
      name: "lambo",
      icon: "http://static.d.intbee.com/FgsRkZVilAzM9bqVz0q7C390bpMu",
      mobile: "18306677680",
      password: md5("123456"),
    }),
    headers: {
      "content-type": "application/json"
    }
  }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the baidu homepage.
    }
  });
})();
