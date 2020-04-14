<template>
  <view class="dropdownContainer" @click="showDrop = !showDrop">
    <image class="icon" mode="widthFix" src="/static/img/m/icon_more.png"/>
    <view class="bg" v-show="showDrop" @click.stop="showDrop = false">{{" "}}</view>
    <view class="dropBody" @click.stop="">
      <view class="menus" :class="{show: showDrop}">
        <view style="background: white">
          <ul>
  	          <li class="item" @click="$emit('click')">
  	            <image mode="widthFix" src="/static/img/m/icon_accusation.png" alt=""/>
  	            <span>举报</span>
  	          </li>
  	      </ul>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
  },
  data () {
    return {
      showDrop: false
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../base.less";
@space: @space-30;
@iconHeight: 60rpx;

.dropdownContainer {
  position: absolute;
  border-radius: 50%;
  top: 30rpx;
  right: 30rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  text-align: center;
  background: rgba(255,255,255,0.8);
  .bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .dropBody {
    position: absolute;
    top: @iconHeight;
    right: -30rpx;
    padding-top: 28rpx;
    min-height: 60rpx;
    overflow: hidden;
    padding: 20rpx;
    padding-top: 32rpx;
    .menus {
      >view {
        border-radius: 8rpx;
      }
      image {
        width: 40rpx;
  			height: 36rpx;
        margin-right: 15rpx;
        vertical-align: middle;
      }
      transform: translateY(-180%);
      transition: transform .3s;
      &.show {
        box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.1);
        transform: translateY(0);
      }

      &::before {
        display: block;
        content: " ";
        position: absolute;
        z-index: -1;
        top: -16rpx;
        right: 20rpx;
        border: 20rpx solid white;
        border-color: white white transparent transparent;
        transform: rotateZ(-45deg);
        border-radius: 6rpx;
        box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.1);
        &.show {
          box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.1);
          transform: rotateZ(-45deg) translateY(0);
        }
      }
      li {
        padding: @space-20 @space-30;
        white-space: nowrap;
      }
    }
  }
}

.icon {
  width: 100%;
  padding: 0 12rpx;
  box-sizing: border-box;
}
</style>
