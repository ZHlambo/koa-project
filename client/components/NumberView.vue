<template>
  <text>{{_value}}</text>
</template>

<script>

export default {
  name: 'Popup',
  props: [
    "value",
    {
      precision: {
        type: Number,
        default: 2
      }
    }
  ],
  watch: {
    value (newVal) {
      this._value = Number(e).toFixed(this.precision);
      return newVal;
    }
  },
  data () {
    return {
      _value: 0,
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
