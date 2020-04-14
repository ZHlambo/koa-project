<template>
  <div @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'LongTouchView',
  props: {
  },
  data () {
    return {
      touchStartTime: 0,
    }
  },
  methods: {
    touchstart (e) {
      this.touchStartTime = new Date().getTime();
      return e;
    },
    touchmove (e) {
      this.touchStartTime = this.touchStartTime && 0;
      return e;
    },
    touchend (e) {
      if (new Date().getTime() - this.touchStartTime > 2 * 1000) {
        this.$emit("longTouch")
      }
      return e;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
