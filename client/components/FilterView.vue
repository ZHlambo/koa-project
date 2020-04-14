<template>
  <ul class="filterContainer" :class="type1">
    <li :class="{active1: current == undefined ? index == now : current == item.value}" v-for="(item, index) in filters" :key="index">
      <text :class="{descIcon: item.order === 'desc',ascIcon: item.order === 'asc', unUse: item.order === 'unUse'}"  @click="clickItem(index, item)">{{item.name || item}}</text>
      <!-- {{item.order}} -->
    </li>
  </ul>
</template>

<script>
export default {
  name: 'FilterView',
  props: ['filters', "current", "type"],
  data () {
    return {
      now: 0
    }
  },
  methods: {
    clickItem (index, item) {
      this.now = index
      this.$emit('changeFilter', {
        index,
        item
      })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../base.less";

.filterContainer {
    display: flex;
    align-items: center;
    font-size: @fs-28;
    &.type1 {
      font-size: @fs-32;
      border-bottom: @border;
      }

    > li {
        flex: 1;
        text-align: center;
        padding: @space-30 0;
        color: @color-99;

        >text {
          cursor: pointer;
          position: relative;
          display: inline-block;
           &::before, &::after {
            position: absolute;
            z-index: 1;
            display: block;
            content: " ";
            width:0;
            height:0;
          }
          &::before {
            top: 50%;
            right: -12px;
            margin-top: 2px;
            border: 5px solid transparent;
          }
          &::after {
            top: 50%;
            right: -12px;
            transform: translateY(-100%);
            margin-top: -2px;
            border: 5px solid transparent;
          }
        }
        &.active {
            font-weight: bold;
            color: @color-33;
        }
        &.active1 {
            position: relative;
            color: @color-33;
            font-size: @fs-32;
            font-weight: bold;
            &::after {
                display: block;
                content: " ";
                background: black;
                width: 20px;
                height: 4px;
                border-radius: 4px;
                margin: auto;
                position: absolute;
                bottom: 10px;
                left: 0;
                right: 0;
            }
        }
    }
    .descIcon {
      &::before {
        border-top: 5px solid #ddd;
      }
      &::after {
        border-bottom: 5px solid #999;
      }
    }
    .ascIcon {
      &::before {
        border-top: 5px solid #999;
      }
      &::after {
        border-bottom: 5px solid #ddd;
      }
    }
    .unUse {
      &::before {
        border-top: 5px solid #ddd;
      }
      &::after {
        border-bottom: 5px solid #ddd;
      }
    }
}
</style>
