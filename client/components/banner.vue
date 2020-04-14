<template>
  <view class="banner" v-if="images && images.length">
    <view class='dots'>
      <text>0{{current+1}}</text>
      <text>/0{{images.length}}</text>
    </view>
    <swiper @change='changeSwiper' :circular="true">
      <swiper-item class="images"  v-for="(item,index) in images" :key="index">
        <image :src="item" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
  </view>
	</view>
</template>

<script>
	export default {
		props: ['images'],
    data() {
      return {
        current: 0,
      }
    },
    methods: {
      changeSwiper (e) {
				let { current } = e.detail;
				this.current = current;
      }
    }
	}
</script>

<style lang="less">
.banner {
  position: relative;
  height: 80vw;
  >swiper {
    height: 100%;
  }
	.dots {
		position: absolute;
		z-index: 3;
		color: #fff;
		bottom: 31rpx;
		right: 33rpx;
	}

	.dots text:nth-child(1) {
		color: #000;
		font-size: 36rpx;
	}

	.dots text:nth-child(2) {
		color: #666;
		font-size: 24rpx;
  }
  .images {
    >image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
