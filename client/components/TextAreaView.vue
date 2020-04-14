<template>
  <view class="textareaView">
    <textarea :placeholder="placeholder" :value="value" @input="input" @change="input" :maxlength="maxlength"> </textarea>
	<!-- #ifndef MP-ALIPAY -->
    <text class="length" v-if="maxlength">{{size}}/{{maxlength}}</text>
	<!-- #endif -->
  </view>
</template>

<script>
export default {
  name: "TextAreaView",
  props: ["placeholder", "maxlength", "value"],
  data () {
    return {
      size: 0
    };
  },
  methods: {
    input (e) {
      console.log(e.detail.value);
      this.value = e.detail.value;
      this.size = this.value.length;
      console.log(this.size);
      if (this.maxlength && this.maxlength < this.size) {
        this.size = this.maxlength;
        this.value = this.value.substr(0, this.maxlength)
      }
      this.$emit("input", this.value);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../base.less";

.textareaView {
  width: 100%;
  height: 100%;
  position: relative;
  padding-bottom: @space-30;
  box-sizing: border-box;

  textarea {
    width: 100%;
    height: 100%;
	box-sizing: border-box;
  }

  .length {
    position: absolute;
    right: 0;
    bottom: 0;
    color: #999;
  }
}

</style>
