<template>
  <view>
    <view class="block">
      <view v-for="(sku,index) in skus" :key="index" class="sku_info">
        <image class="product_icon" :src="product.images[0]"></image>
        <view class="info">
          <view class="fl">{{product.name}}</view>
          <view class="fn">{{sku.standard}}</view>
          <view class="flex">
            <text class="flex1 fm">￥{{sku.price}}</text>
            <view class="fm c9">x{{sku.buy_num}}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="block">
      <view class="input">
        <text>收货手机号</text>
        <input type="text" maxlength="11" placeholder="11位手机号码" v-model="receive_mobile">
      </view>
      <view class="input">
        <text>收货地址</text>
        <input type="text" maxlength="50" placeholder="详细地址" v-model="receive_address">
      </view>
      <view class="input">
        <text>备注</text>
        <input type="text" maxlength="100" placeholder="买家备注" v-model="note">
      </view>
    </view>
    <view class="btn-bottom">
      <view>
        总金额：￥{{total_price}}元
      </view>
      <view @click="order_on">下单</view>
    </view>
  </view>
</template>

<script>
	export default {
		data() {
			return {
        s_uuid: '582c0749b47111e98c43107b44809a04',
        skus: '',
        product: '',
        receive_mobile: '19900000000',
        receive_address: '',
        note: '',
        total_price: 0,
			}
		},
    onLoad () {
      // s_uuid skus sku_id quantity receive_mobile receive_address note
      let sku = uni.getStorageSync('sku');
      let product = uni.getStorageSync('product');
      if (!sku) {
	      uni.showModal({
	          title: `提示`,
	          content: '没有下单产品，请返回',
            showCancel: false,
	          success: async res => {
              this.back();
	          }
	      });
      } else {
        this.skus = [sku,sku];
        this.skus.forEach(e => {
          this.total_price += e.price*e.buy_num;
        })
        this.product = product;
        this.total_price = this.total_price.toFixed(2);
      }
    },
		methods: {
      order_on: async function () {
        let {skus,s_uuid,receive_mobile,receive_address,note} = this;
        if (!/^((13[0-9])|(14[0-9])|(15([0-9]))|(166)|(17[0-9])|(18[0-9])|(19[8,9]))\d{8}$/.test(receive_mobile)) {
          return this.$toast("请输入正确的11位手机号码");
        }
        if (!receive_address) {
          return this.$toast("请输入收货地址");
        }
        let res = await this.$http.post('/client/order', {
          s_uuid, skus: skus.map(e => ({sku_id: e.id, quantity: e.buy_num})),
          receive_mobile,receive_address,note
        });
        if (res.code) {
          return this.$toast(res.msg);
        } else {
          uni.setStorageSync("order_no", res.order_no);
        }
      }
    }
	}
</script>

<style lang="less">
.sku_info {
  display: flex;
  padding-top: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: 0;
  }
  .info {
    flex: 1;
    margin-left: 30rpx;
    >view {
      margin-bottom: 10rpx;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .buy_num {
    font-size: 20rpx;
    color: #999;
  }
}
</style>
