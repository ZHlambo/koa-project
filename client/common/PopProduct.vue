<template>
  <view>
    <view @click='toggle' catchtouchmove="preventScroll" :class="{'pop-mask': true, 'active': showModal}"></view>
    <view catchtouchmove="preventScroll" :class="{'pop-content': true, 'active': showModal}">
      <view v-if="showModal && product" class="pop-container">
        <view class="header">
          <image :src="product.images[0]"></image>
          <view class="info">
            <view class="fn fw mb10"> {{product.name}} </view>
            <view>￥{{sku ? sku.price : product.price}}</view>
          </view>
        </view>
        <view class="standards">
          <view v-for="(standard,index) in product.standards" :key='index'>
            <view class="fl fw">{{standard.name}}</view>
            <view class="standards-selected">
              <view v-for="(value,_index) in standard.values" :key='_index'
                @click='clickItem(value, standard.name)' :class='{active: selected[standard.name] == value, disabled: !(usefulStandards[standard.name] && usefulStandards[standard.name].has(value))}'>{{value}}</view>
            </view>
          </view>
        </view>
        <view class="quantity-view">
          <view>
            <view>购买数量</view>
            <view class='fs c9'>库存：{{sku ? sku.quantity : product.quantity}}</view>
          </view>
          <view class="num" :class='{disabled: sku ? !sku.quantity : !product.quantity}'>
            <view @click='c_buy_num(-1)'>-</view>
            <input type="number" v-model="buy_num" @blur="blur"/>
            <view @click='c_buy_num(1)'>+</view>
          </view>
        </view>
        <view class="btn" :class="{disabled: !sku || !sku.quantity}" @click='buy'>
          下一步
        </view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'Popup',
  props: ['product'],
  data () {
    return {
      showModal: false,
      sku: '',
      usefulStandards: {},
      selected: {},
      buy_num: 1,
    };
  },
  methods: {
    toggle() {
      this.showModal = !this.showModal;
      if (this.showModal) {
        this.setUsefulStandards();
      }
    },
    preventScroll() {
      // console.log("11")
    },
    clickItem (value, standard) {
      let {usefulStandards} = this;
      if (usefulStandards[standard] && !usefulStandards[standard].has(value)) {
        return ;
      }
      this.selected[standard] = this.selected[standard] == value ? '' : value;

      this.selected = {...this.selected};
      this.sku = '';
      this.product.skus.forEach(sku => {
        if (Object.keys(sku.standard_obj).every(key => sku.standard_obj[key] === this.selected[key])) {
          this.buy_num = 1;
          this.sku = sku;
        }
      })
      this.setUsefulStandards();
    },
    setUsefulStandards () {
      let standards = this.product.standards;
      let {selected, usefulStandards} = this;
      let skus = this.product.skus;
      for (let i = 0; i < standards.length; i++) {
        usefulStandards[standards[i].name] = [].concat(skus);
        let usefulStocks = usefulStandards[standards[i].name];
        for (let j = 0; j < standards.length; j++) {
          if (i != j) {
            if (selected[standards[j].name]) {
              for (let l = 0; l < usefulStocks.length; l++) {
                if (usefulStocks[l].standard_obj[standards[j].name] !== selected[standards[j].name]) {
                  usefulStocks.splice(l, 1);
                  l--;
                }
              }
            }

          }
        }
      }
      for (var key in usefulStandards) {
        usefulStandards[key] = new Set(usefulStandards[key].map(e => e.standard_obj[key]));
      }
      this.usefulStandards = usefulStandards;
    },
    blur () {
      if (!this.sku) {
        this.buy_num = 1;
        return this.$toast('请先选择规格');
      }
      this.buy_num = Number(this.buy_num) == 0 ? 1
        : Number(this.buy_num) > this.sku.quantity ? this.sku.quantity || 1
        : Number(this.buy_num);
    },
    c_buy_num (num) {
      if (!this.sku) {
        return this.$toast('请先选择规格');
      }
      this.buy_num = (this.buy_num+num == 0 || this.buy_num+num > this.sku.quantity) ? this.buy_num : this.buy_num+num;
    },
    buy () {
      let {sku, buy_num} = this;
      if (sku && sku.quantity) {
        this.$emit('next', {...sku,buy_num})
        this.buy_num = 1;
        this.sku = '';
        this.selected = {};
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

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
.pop-container {
  position: relative;
  min-height: 500rpx;
  background: white;
  >.header {
    border-bottom: 1rpx solid #ddd;
    width: calc(100% - 60rpx);
    margin: 0 30rpx;
    display: flex;
    >image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 4rpx;
      margin-top: -20rpx;
      padding-bottom: 30rpx;
    }
    .info {
      flex: 1;
      padding: 20rpx;
    }
  }
}

.standards {
  padding: 30rpx;
  >view {
    margin-bottom: 30rpx;
  }
  .standards-selected {
    display: flex;
    flex-wrap: wrap;
    >view {
      padding: 5rpx 20rpx;
      border-radius: 30rpx;
      border: 1rpx solid #ddd;
      margin-top: 20rpx;
      margin-right: 20rpx;
      &.active {
        border: 1rpx solid red;
        background: red;
        color: white;
      }
      &.disabled {
        color: #ccc!important;
        background: rgba(249,249,249,1)!important;
      }
    }
  }
}
.quantity-view {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #ddd;
  border-bottom: 1rpx solid #ddd;
  >view:first-child {
    flex: 1;
  }
  .num {
    display: flex;
    align-items: center;
    width: 160rpx;
    text-align: center;
    >view {
      border: 1rpx solid #ddd;
      flex: 1;
      line-height: 60rpx;
      height: 60rpx;
    }
    input {
      border: 1rpx solid #ddd;
      flex: 2;
      line-height: 60rpx;
      height: 60rpx;
      user-select: none;
    }
  }
}
.btn {
  margin: 20rpx 40rpx;
  width: calc(100% - 80rpx);
  border-radius: 60rpx;
  line-height: 60rpx;
  height: 60rpx;
  background: red;
  color: white;
  text-align: center;
  &.disabled {
    background: #ddd!important;
  }
}
</style>
