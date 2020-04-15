<template>
  <view>
    <view class="title">登录我小程序</view>
    <view class="login_view">
      <input type="text" maxlength="11" placeholder="11位手机号码" v-model="mobile"/>
      <input type="password" maxlength="25" placeholder="6-25位密码" v-model="password"/>
    </view>
    <view class="login_btn" @click="click_login">登录</view>
  </view>
</template>

<script>
import md5 from "../lib/md5.js";
	export default {
		data() {
			return {
        mobile: '18306677680',
        password: '123456'
			}
		},
    onLoad () {
      this.getData();
    },
		methods: {
      click_login: async function () {
        let {mobile, password} = this;
        if (!/^((13[0-9])|(14[0-9])|(15([0-9]))|(166)|(17[0-9])|(18[0-9])|(19[8,9]))\d{8}$/.test(mobile)) {
          return this.$toast("请输入正确的11位手机号码");
        }
        if (!password || password.length < 6) {
          return this.$toast("请输入6-25位密码");
        }
        let res = await this.$http.post("/client/user/login/mobile", {mobile,password: md5(password)});
        if (res.code) {
          return this.$toast(res.msg);
        } else {
          uni.setStorageSync('user', res);
          this.$http.setToken(res);
          this.$toast('登录成功').then(() => uni.reLaunch({url: '/pages/home'}));
        }
      }
    }
	}
</script>

<style lang="less">
.title {
  margin: 100rpx 40rpx 0 60rpx;
  font-size: 40rpx;
  font-weight: bold;
}
.login_view {
  padding: 60rpx;
  input {
    padding: 30rpx 0;
    border-bottom: 1px solid #ddd;
  }
}
.login_btn {
  line-height: 60rpx;
  height: 60rpx;
  border-radius: 60rpx;
  width: 500rpx;
  margin: auto;
  background: red;
  color: white;
  letter-spacing: 20rpx;
  text-indent: 20rpx;
  text-align: center;
}
</style>
