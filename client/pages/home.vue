<template>
  <view>
    <banner :images="product.images"/>
    <view class="cell fl fw">{{product.name}}</view>
    <view class="rich_text">
      <rich-text :nodes="product.descs"></rich-text>
    </view>
    <view class="btn-bottom">
      <view>
        <text>联系客服</text>
        <button open-type="contact">联系客服</button>
      </view>
      <view @click="showPop">立即购买</view>
    </view>
    <PopProduct v-if='product' ref="pop" :product="product" @next="buy"></PopProduct>
  </view>
</template>

<script>
	import TabBars from '../components/TabBars.vue';
	import banner from '../components/banner.vue';
	import PopProduct from '../common/PopProduct.vue';
	export default {
		data() {
			return {
        product: '',
			}
		},
		components: {
      banner,
      PopProduct
		},
		onReachBottom: function() {
		},
    onLoad () {
      this.getData();
    },
		methods: {
      getData: async function () {
        this.$http.get('/client/product/10480179').then(product => {
          product.images = product.images.split(";");
          console.log(product);
          let min = 0,max=0;
          product.quantity = 0;
          product.standard_obj = {};
          product.skus.map(sku => {
            product.quantity += sku.quantity;
            sku.price = Number(sku.price);
            min = min ? Math.min(min,sku.price) : sku.price;
            max = max ? Math.max(max,sku.price) : sku.price;
            sku.standard_obj = {};
            sku.standard.split(";").filter(e => e).map(e => {
             let key = e.split(':');
             let value = e.split(':')[1];
             key = e.split(':')[0];
             sku.standard_obj[key] = value;
             product.standard_obj[key] = product.standard_obj[key] || [];
             product.standard_obj[key].push(value);
            })
          });
          product.price = min == max ? min : `${this.toFixed(min)}~${this.toFixed(max)}`;
          product.standard_keys = product.skus[0].standard.split(";").filter(e => e).map(e => e.split(':')[0]);
          Object.keys(product.standard_obj).forEach(key => {
            product.standard_obj[key] = Array.from(new Set(product.standard_obj[key]));
          })
          product.standards = product.standard_keys.map(name => {
            return {name, values: product.standard_obj[name]};
          })

          // DEBUG:
          product.descs = `<div style="color:blue">adffasfds</div>`
          console.log(product);
          this.product = {...product};
          console.log(this.product);
          setTimeout(e => {
            this.$refs.pop.toggle();
          },300)
        })
      },
      showPop () {
        this.$refs.pop.toggle();
      },
      buy (sku) {
        this.$refs.pop.toggle();
        uni.setStorageSync('sku', sku);
        uni.setStorageSync('product', this.product);
        this.goRouter('/pages/order_on');
      }
    }
	}
</script>

<style lang="less">
.rich_text {
  padding: 0 30rpx;
}
</style>
