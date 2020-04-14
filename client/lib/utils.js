import upload from "./upload";
import config from "./config"
import http from "./http"

const formatDate = (time, format) => {
  if (time == '' || time == null || time == undefined)
    return ''
  time = new Date(time)
  const datetime = new Date()
  datetime.setTime(time)
  const year = datetime.getFullYear()
  const month = datetime.getMonth() + 1 < 10
    ? '0' + (
    datetime.getMonth() + 1)
    : datetime.getMonth() + 1
  const date = datetime.getDate() < 10
    ? '0' + datetime.getDate()
    : datetime.getDate()
  const hour = datetime.getHours() < 10
    ? '0' + datetime.getHours()
    : datetime.getHours()
  const minute = datetime.getMinutes() < 10
    ? '0' + datetime.getMinutes()
    : datetime.getMinutes()
  const second = datetime.getSeconds() < 10
    ? '0' + datetime.getSeconds()
    : datetime.getSeconds()
  const timeArr = [
    year,
    month,
    date,
    hour,
    minute,
    second
  ]
  let _mapper = {};
  [
    'YYYY',
    'MM',
    'DD',
    'hh',
    'mm',
    'ss'
  ].forEach((_symbol, i) => (_mapper[_symbol] = timeArr[i]))
  if (format) {
    const matchArr = format.match(/\w+/g)
    matchArr.forEach(match => {
      format = format.replace(match, _mapper[match])
    })
    return format
  } else {
    return (year + '月' + month + '月' + date + '日 ' + ' ' + hour + ':' + minute)
  }
}
var loading = false;
export const showToast = {
  message: (msg, duration = 2000) =>
    new Promise(function(resolve) {
      uni.hideLoading();
      uni.showToast({title: msg, icon: "none", duration})
      setTimeout(() => {
        resolve();
      }, duration - 100); //提前关闭，防止toast消失了，还没执行end函数
    }),
  loading: (msg) => {
    loading = true;
    uni.hideLoading();
    uni.showLoading({title: msg || "加载中",icon: "loading", mask: true})
  },
  hide: (msg) => {
    loading = false;
    uni.hideLoading();
  },
  isloading: () => loading,
}

export const orderStatus = {
  cancelled: "10",// 取消订单
  pending: "11",
  payCancelled: "20",// 支付超时关闭
  waitGroup: "21",
  waitToFriend: "22",
  processing: "25",
  delivering: "26",
  completed: "27",
  finish: "28",
  refunded: "30",
  refundingSys: "31",
  refunding: "32",
  applyReturning: "34",
  returned: "40",
  returning: "35",
  onhold: "42",
  closed: "50",// 系统退款关闭
  refundedF: "60",// 商家无货退款
}

const formatOrder = (order, counterInfos) => {
  order.counterInfo = {};
  order.freight_amount_str = Number(order.freight_amount || 0).toFixed(2);
  order.buyer_pay_amount_str = Number(order.buyer_pay_amount || 0).toFixed(2);
  // TODO:
  counterInfos && counterInfos.forEach(item => {
    if (item.uuid === order.spreader_uuid) {
      order.counterInfo = item;
    }
  })
  // TODO:
  // if (order.extension && order.extension.short_url) {
  //   order._order_url = `${location.origin}/customer/tofriend/${order.extension.short_url}`;
  // }
  order.total_quantity = 0;
  if (order.delivery) {
    order.delivery_address = order.delivery.province + order.delivery.city + order.delivery.district + order.delivery.address;
  }
  order.sku_list && order.sku_list.forEach(item => {
    order.total_quantity += item.quantity;
    item.product_image = item.product_image.split(";")[0];
    item.standardsStr = item.standards.map(item => item.value || "无").join(" ");
  })
  order.preferential && order.preferential.forEach(item => {
    if (item.code === "group") {
      item._preferential = item.preferential * order.total_quantity;
    }
    item._preferential = (Number(item._preferential || item.preferential)).toFixed(2);
  })
  order._created_at = formatDate(Number(order.created_at) * 1000, "YYYY-MM-DD hh:mm:ss")
  let payNoSent = order.order_status == orderStatus.waitGroup || order.order_status == orderStatus.waitToFriend || order.order_status == orderStatus.processing
  let isSent = order.order_status == orderStatus.delivering ||  order.order_status == orderStatus.completed || order.order_status == orderStatus.finish || order.order_status == orderStatus.returned || order.order_status == orderStatus.returning || order.order_status == orderStatus.onhold || order.order_status == orderStatus.closed;
  let isOver = order.order_status == orderStatus.completed && new Date().getTime() - order.order_history[order.order_history.length - 1].change_at > 86400000 * 7
  let hasReturn = order.order_status === orderStatus.returning || order.order_status === orderStatus.applyReturning || order.order_status === orderStatus.returned;

  Object.assign(order, {
    groupWait: order.order_status == orderStatus.waitGroup,
    groupFail: order.order_type == 2 && order.order_status == orderStatus.cancelled,
    groupSuccess: order.order_type == 2 && isSent,
    isSent,
    payNoSent,
    isOver,
    hasReturn
  });
  order.order_history.forEach(item => {
    item.change_at_str = formatDate(item.change_at, "YYYY.MM.DD hh:mm:ss");
  })
  return order;
}

const isImageUrl = (url) => {
  return url.indexOf(uni.getStorageSync("access_host")) !== -1;
}
const copyData = (data, msg) => {
  uni.setClipboardData({
    data,
    success(res) {
      uni.getClipboardData({
        success: res => {
          if (msg !== "") {
            showToast.message(msg || "复制成功")
          }
        },
        fail: res => {
          showToast.message("复制失败")
        }
      })
    }
  })
}

// NOTE: checkLogin 为 true 不重定向
export const isLogin = (checkLogin, beforeRelogin) => {
  let user = uni.getStorageSync("user");
  return new Promise((resolve, reject) => {
    if (user && user.uuid) {
      setTimeout(() => {// NOTE: 字节跳动小程序需要延迟渲染，否则还没渲染就关闭，有bug
        resolve(user);
      },100)
    } else {
      beforeRelogin && beforeRelogin();
      showToast.loading();
      uni.login({
        success: success => {
          if (success.code) {
            http.post(`${config.host_uc}/api/uc/Oauth2/${config.platform == "weixin" ? "miniprogram" : (config.platform == "douyin" ? "douyin-program" : "alipay")}/login`, {code: success.code}).then(res => {
              if (res.uuid) {
                http.setToken(res.access_token);
                http.get(`/capi/user`).then(data => {
                  user = Object.assign(res, data);
                  uni.setStorageSync("user", user);
                  showToast.hide("登录成功");
                  showToast.message("登录成功").then(() => {
                    let reportData = uni.getStorageSync("reportData");
                    if (reportData) {
                      reportData.login_success = "自动登录";
                      uni.reportAnalytics("navigator", reportData);
                      uni.setStorageSync("reportData", "");
                    }
                    resolve(user);
                  });
                })
              } else {
                showToast.hide("登录成功");
                if (checkLogin) {
                  reject(()=>{
                    uni.navigateTo({url: `/pages/auth?code=${res.code}`})
                  });
                } else {
                  uni.navigateTo({url: `/pages/auth?code=${res.code}`})
                }
              }
            });
          } else {
            showToast.message(success.errMsg);
          }
        },
        fail: function() {
          showToast.message('授权登录接口调用失败');
        }
      });
    }
  });
}

const payOrder = (order_no, no_redirect) => {
  showToast.loading();
  let url = config.platform === "weixin"
    ? `/public/order/pay/${order_no}/wxpay/wx_lite`
    : `/public/order/pay/${order_no}/alipay_lite`
  var completed = function () {
    if (!no_redirect) {
      uni.navigateTo({url: `/pages/order/payresult?order_no=${order_no}`});
    } else {
      no_redirect()
    }
  }
  var openid = uni.getStorageSync('openid');
  var obj = {
	  open_id: openid,
  }
  if (config.platform != 'weixin') {
	  obj.type = config.platform
  }
  console.log(obj)
  let fail = false;
    setTimeout(() => {
      if (!fail) {
        fail = true;
        completed();
      }
    }, 60 * 1000);
  return http.post(url, obj).then(payData => {
	console.log(payData)
    uni.requestPayment({
      ...payData.credential,// NOTE: 微信小程序支付
      data: payData.detail,// NOTE: 字节跳动小程序支付
	  tradeNO: payData.trade_no,
      success: function (e) {
		console.log(e)
        if (fail) {
          return ;
        }
		//#ifdef MP-ALIPAY
			if (e.resultCode != '6001') {
				showToast.message(`支付成功`).then(completed);
			} else {
				completed()
			}
			
		//#endif
		// #ifndef MP-ALIPAY
			showToast.message(`支付成功`).then(completed);
		//#endif
        
      },
      fail: function (e) {
		  console.log(222)
        if (fail || !e) {
          return ;
        }
        if (e.errMsg && e.errMsg.indexOf("cancel") != -1) {
          completed();
        } else {
          if (uni.getStorageSync("debug")) {
            copyData(`payData=${JSON.stringify(payData)};order_no=${order_no};err=${JSON.stringify(e)}`)
          }
          console.error(e);
          showToast.message(`支付失败:${JSON.stringify(e)}`).then(res => {
            completed();
          });
        }
        showToast.hide();
      },
    })
  }, err => {
    console.error(err);
    if (uni.getStorageSync("debug")) {
      copyData(`err=${JSON.stringify(err)};`)
    }
    if (err.code) {
      showToast.message(err.message).then(res => {
        if (err.code === 1091) {
          uni.setStorageSync("path", getCurrentPage().replace(/^\//, ""));
          uni.navigateTo({url: `/pages/auth?lite=1`})
        }
      });
    }
  });
}

const getCurrentPage = () => {
  let currentPages = getCurrentPages();
  let page = currentPages[currentPages.length - 1];
  let url = `/${page.route}?`;
  for (let key in page.options) {
    url += `${key}=${page.options[key]}&`;
  }
  return url.substring(0, url.length - 1);
}

export default {
  isLogin,
  upload,
  isImageUrl,
  copyData,
  formatDate,
  orderStatus,
  showToast,
  formatOrder,
  payOrder,
  getCurrentPage,
}
