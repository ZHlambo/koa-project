<template>
  <view>
    <view @click='toggleModal' catchtouchmove="preventScroll" :class="{'pop-mask': true, 'active': showModal}"></view>
    <view catchtouchmove="preventScroll" :class="{'pop-content': true, 'active': showModal}">
      <slot />
    </view>
  </view>
</template>

<script>

export default {
  name: 'Popup',
  data () {
    return {
      showModal: false,
    };
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
    preventScroll() {
      // console.log("11")
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

</style>
