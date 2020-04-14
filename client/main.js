import Vue from 'vue'
import App from './App'
import utils from './lib/utils'
import http from './lib/http'
import config from './lib/config'
import NumberView from "./components/NumberView.vue";

Vue.config.productionTip = false
Vue.prototype.$utils = utils
Vue.prototype.$toast = utils.showToast.message;
Vue.prototype.$loading = utils.showToast.loading;
Vue.prototype.$hide = utils.showToast.hide;
Vue.prototype.formatDate = utils.formatDate;
Vue.prototype.$http = http
Vue.prototype.$config = config

App.mpType = 'app'
// 初始化某些 storage
uni.setStorageSync("reportData", "");
// // NOTE: 获取手机校验正则，缓存七天
// let mobile_cn = uni.getStorageSync('mobile_cn');
// if (!mobile_cn || mobile_cn.create_time + 86400000 * 7 > new Date().getTime())
// http.get(`/api/app/verify/rule`).then(e => {
//   uni.setStorageSync('mobile_cn', {mobile_cn:e.mobile_cn, create_time: new Date().getTime()});
// })

var routers =[]
var updateManager = uni.getUpdateManager();
updateManager.onUpdateReady(function() {
    uni.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
            if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
            }
        }
    });
});
Vue.mixin({
  components: {
    num: NumberView
  },
  methods: {
    toFixed (num, n=2) {
      return num && Number((num).toFixed(n));
    },
    // NOTE: 小程序页面堆栈最多10个
    goRouter (url) {
      utils.showToast.hide();
      url = url.url || url;
      let task = getCurrentPages().map(e => `/${e.route}`);
      if (task.length >= 10) {
        routers.push(url)
        uni.redirectTo({url});
      } else {
        routers = task; // NOTE: 防止物理返回到第九个页面这里router还没更新
        routers.push(url);
        uni.navigateTo({url});
      }
    },
    redirectTo (url) {
      utils.showToast.hide();
      uni.redirectTo({url});
    },
    back () {
      utils.showToast.hide();
      let task = getCurrentPages().map(e => `/${e.route}`);
      if (task.length < 10) {
        routers = task; // NOTE: 防止物理返回到第九个页面这里router还没更新
      }
      routers.pop();
      if (routers.length > 10) {
        uni.redirectTo({url: routers[routers.length-1]});
      } else {
        uni.navigateBack();
      }
    },
  }
})

const app = new Vue({
    ...App
})
app.$mount()
