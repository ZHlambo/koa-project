<template>
  <view class="tabbar" v-if="index != -1">
    <view @click="index==1 && redirectTo('/pages/home')">
      <image v-if="index==1" src="/static/img/m/tab_fx_n.png" />
      <image v-else src="/static/img/m/tab_fx_s.png" />
      <view>发现</view>
    </view>
    <view @click="index==0 && redirectTo('/pages/my-center/index')">
      <image v-if="index==0" src="/static/img/m/tab_personal_n.png" />
      <image v-else src="/static/img/m/tab_personal_s.png" />
      <view>我的</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        index: -1
      };
    },
    mounted () {
      let items = [
        '/pages/home',
        '/pages/my-center/index',
      ];
      let index = items.findIndex(e => e == this.$utils.getCurrentPage());
      console.log(index, this.$utils.getCurrentPage());
      this.index = index;
    }
  }
</script>

<style lang="less">
.tabbar {
  background: black;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background: white;
  z-index: 999;
  border-top: 1px solid #eee;
  display: flex;
  >view {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20rpx;
    image {
      width: 40rpx;
      height: 40rpx;
      margin-bottom: 5rpx;
    }
  }
}
</style>
