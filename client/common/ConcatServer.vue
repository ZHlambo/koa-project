<template>
  <view>
    <Popup ref="server">
      <view class='cs-modal c-333'>
        <view class='c-title b-b f-32'>
            联系厂商<text class='f-24' @click='clickImage'>(营业执照)</text>
        </view>
        <view class="c-list">
          <view>客服电话</view>
          <view @click='copy(shopDetails.phone)' >{{shopDetails.phone || "暂无信息"}}</view>
        </view>
        <view class="c-list">
          <view>客服QQ</view>
          <view @click='copy(shopDetails.qq)' >{{shopDetails.qq || "暂无信息"}}</view>
        </view>
        <view class="c-list">
          <view>客服邮箱</view>
          <view @click='copy(shopDetails.mail)' >{{shopDetails.mail || "暂无信息"}}</view>
        </view>
        <view @click='toggleModal' class='c-fixed h-100 f-28'>
          取消
        </view>
      </view>
    </Popup>
    <view catchtouchmove="cm" v-if="showImg" class='img-modal' @click="clickImage">
      <image :src="shopDetails.img" mode="widthFix"></image>
    </view>
  </view>
</template>

<script>
import Popup from '../components/Popup.vue'

export default {
  name: 'ConcatServer',
  components: {
    Popup,
  },
  data () {
    return {
      shopDetails: {},
      showImg: false,
      shopId: "",
			qq: ''
    };
  },
  mounted: function() {
    this.pop = this.$refs.server;
  },
  methods: {
    toggleModal (shopId) {
      console.log(shopId);
      if (!this.pop.showModal && shopId !== this.shopId) {
        this.shopId = shopId;
        this.$utils.showToast.loading();
        this.$http.get(`/capi/shop/${shopId}`).then((res) => {
          let obj = {};
          res.support_methods.forEach(e => {
            obj[e.type] = e.content;
          });
          this.$utils.showToast.hide();
          console.log(obj);
          this.shopDetails = {
            img: res.business_license,
            phone: obj.phone,
            qq: obj.qq,
            mail: obj.mail,
          }
        })

      }

      this.pop.toggleModal();
    },
    clickImage() {
      this.showImg = !this.showImg
    },
    copy(item) {
      if (!item) {
        return ;
      }
      var that = this;
      wx.setClipboardData({
        data: item,
        success(res) {
          wx.getClipboardData({
            success(res) {
              console.log(res.data) // data
            }
          })
        }
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../base.less";

.cs-modal{
  height: 560rpx;
  background: #fff;
}
.c-title{
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
}
.c-title view{
  color: #fc0;
}
.c-list{
  height: 100rpx;
  font-size: 28rpx;
  display: flex;
  justify-content: space-between;
  padding: 0 20rpx;
  color: #000;
  line-height: 100rpx;
}
.c-fixed{
  line-height: 100rpx;
  background: #fced4e;
  text-align: center;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100
}
.c-title text{
  text-decoration: underline;
  color: #fc0;
}
.img-modal{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  background: rgba(0,0,0,0.5);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%
}
.img-modal image{
  display: block;
  width: 700rpx;
}

</style>
