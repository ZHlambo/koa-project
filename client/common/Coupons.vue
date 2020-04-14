<template>
  <view>
    <view @click='toggleModal' :class="{'pop-mask': true, 'active': showModal}"></view>
    <view catchtouchmove="preventScroll" :class="{'pop-content': true, 'active': showModal}">
      <view class="coupons">
        <view class="header">优惠券</view>
        <scroll-view class="scroll" scroll-y>
        <view class="content">
          <view v-for="(item, index) in _coupons" :key="index" @click="$emit('click', item)">
            <view class="left">
              <image :src="'/static/img/coupons_'+(item.template - 1 == -1 ? 1 : item.template)+'.png'"></image>
              <view><text>￥</text><text class="price">{{item.coupon_price}}</text></view>
              <view>{{item.coupon_price_limit > 0 ? "满￥" + item.coupon_price_limit + "可用" : "无条件使用"}}</view>
            </view>
            <view class="right">
              <image src="/static/img/coupons_right.png"></image>
              <view class="name">{{item.name}}</view>
              <view class="time">{{item.begin_time_str + " - " + item.end_time_str}}</view>
              <view v-if="showReceive" class='receive'>
              <text @click="$emit('receive', item)">立即领取</text>
              </view>
              <image v-if="!showReceive && coupon.id === item.id" class="choose" src="/static/img/m/icon_checked.png"></image>
            </view>
          </view>
        </view>
        </scroll-view>
        <view class="footer" @click="toggleModal">取消</view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  props: {
      coupons: {
          type: Array,
          default: []
      },
      coupon: {
          type: Object,
          default: {}
      },
      showReceive: {
          type: Boolean,
          default: false
      }
  },
  data () {
    return {
      _coupons: [],
      showModal: false,
    };
  },
  watch: {
    coupons (newVal) {
      console.log(newVal);
      newVal.forEach(item => {
        item.begin_time_str = this.$utils.  formatDate(item.begin_time, "YYYY.MM.DD");
        item.end_time_str = this.$utils.formatDate(item.end_time, "YYYY.MM.DD");
      });
      this.setData({_coupons: [].concat(newVal)});
    }
  },
  methods: {
    toggleModal () {
      this.showModal = !this.showModal;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../base.less";

.coupons {
  .header {
    height: @cell-height;
    line-height: @cell-height;
    text-align: center;
    border-bottom: @border;
  }
  .footer {
    height: @cell-height;
    line-height: @cell-height;
    text-align: center;
    border-top: @border;
  }
  .scroll {
    max-height: 700rpx;
  }
  .content {
    padding-bottom: @space-30;
    >view {
      margin: @space-30;
      margin-bottom: 0;
      display: flex;
      align-items: center;

      >view>image {
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
        width: 100%;
        height: 200rpx;
      }
      .choose {
        top: 50% !important;
        right: @space-20 !important;
        left: auto !important;
        width: 36rpx !important;
        height: 36rpx !important;
        transform: translateY(-50%);
      }
      .left {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 234rpx;
        height: 200rpx;
        color: white;
        font-size: 26rpx;
        text {
          font-size: 40rpx;
          font-weight: bold;
        }
        .price {
          font-size: 80rpx;
        }
      }
      .right {
        position: relative;
        padding: @space-20;
        padding-right: @space-40;
        height: 200rpx;
        box-sizing: border-box;
        flex: 1;
        .name {
          min-height: 62rpx;
        }
        .time {
          font-size: @fs-22;
          color: #999;
        }
      }
    }
  }
}


.receive{
  text-align: right;
  padding-top: 20rpx;
}
.receive text{
  text-decoration: underline;
}

.pop-mask{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: none;
  z-index: 10;
  overflow: hidden
}
.pop-mask.active{
  display: block
}
.pop-content{
  position: fixed;
  bottom: 0;
  width: 750rpx;
  background: white;
  transform: translateY(150%);
  transition: all 0.4s ease;
  z-index: 12;

}
.pop-content.active{
  transform: translateY(0);
}


</style>
