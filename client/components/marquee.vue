<template>
  <view class="marquee">
    <text :style="'transform:translateX(-'+marginLeft+'%)'" space="emsp">{{text}}</text>
    <text :style="'transform:translateX(-'+marginLeft+'%)'" space="emsp">{{text}}</text>
  </view>
</template>

<script>

export default {
  name: 'marquee',
  props: ['text', 'rate'],
  data () {
    return {
      marginLeft: 0,
      interval: '',
      pages: getCurrentPages().length,
    };
  },
  created () {
    let len = this.text.length;
    this.interval = setInterval(() => {
      this.marginLeft += 0.5 / Math.ceil(len / 30);
      if (this.marginLeft >= 100) {
          this.marginLeft = 0;
      }
    }, (this.rate || 1) * 50);
  },
  beforeDestroy () {
    this.interval && clearInterval(this.interval);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.marquee {
  width: 100%;
  word-break: keep-all;
  white-space: nowrap;
  font-size: 28rpx;
  >text {
    display: inline-block;
    width: auto;
    padding-right: 60rpx;
    min-width: 100%;
  }
}

</style>
