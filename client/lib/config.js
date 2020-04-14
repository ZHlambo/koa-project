let config = "";
let platform = "";
//#ifdef MP-WEIXIN
platform = "weixin";
//#endif
//#ifdef MP-TOUTIAO
platform = "douyin";
//#endif
//#ifdef MP-ALIPAY
platform = "alipay";
//#endif
// NOTE: 发布test
const publishTest = false;
if (process.env.NODE_ENV === 'development') {
  // NOTE: 测试1
  config = {
    test: true,
    platform,
    app_id: "101",
	// host: "https://item.intbee.com",
	// host_uc: "https://api.intbee.com",
    host: "http://localhost:8000",
    wx_app_id: "wxc9d0a70977ecf5fe",
  }
} else {
  // NOTE: 正式
  config = {
    test: false,
    platform,
    app_id: "101",
    host: "https://item.intbee.com",
  }
}
config.platform = platform;
export default config;
