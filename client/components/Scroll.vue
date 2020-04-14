<template>
  <scroll-view :class="className" :scroll-y="!showHeight" style="height:100%;overflow:auto" @scroll="_scroll" @scrolltoupper="_toupper" @scrolltolower="_tolower" upper-threshold="0">
    <view style="height:100%"  @touchmove="_move" @touchstart='_start' @touchend='_end' @touchcancel='_end'>
      <view :style="'position:relative;height:' + (showHeight) + 'px;' + (end && 'transition: height .3s' || '') + ';overflow:hidden'">
        <view class="header" :style="'max-height:' + (viewHeight) + 'px;'">
          <view class="dots">
            <view :style="'background:' + ((end || refreshing) && lingthDot%3 == 0 ? 'white' : 'gray')"></view>
            <view :style="'background:' + ((end || refreshing) && lingthDot%3 == 1 ? 'white' : 'gray')"></view>
            <view :style="'background:' + ((end || refreshing) && lingthDot%3 == 2 ? 'white' : 'gray')"></view>
          </view>
        </view>
      </view>
      <view>
        <slot></slot>
      </view>
      <view v-if="loadMore !== 0 && canLoadMore" class="loadMore">
        <view @click='loadMore == 1 ? "_tolower" : ""'>
          <view v-if="loadMore == -1" class="loading"></view>
          <text>{{loadMore == -1 ? "正在加载中" : loadMore === 1 ? "加载更多" : "全部加载完"}}</text>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
/**
  * 使用该组件，注意外框元素必须有高度
  */
export default {
  name: 'Scroll',
  props: ["hasMore"],
  data () {
    return {
        startTouch: false, // 是否开始触碰视图
        lingthDot: 0, // 刷新视图中，亮点的视图
        startX: 0, // 触碰事件的第一个点X
        startY: 0, // 触碰事件的第一个点Y
        showHeight: 0, // 刷新视图的可视高度
        viewHeight: 75, // 刷新视图的最终真实高度
        end: false, //触摸事件结束标志，为视图添加css transition实现回滚效果
        scrollY: 0, // 视图滚动的位置，当为0时，则可以触发下拉刷新视图
        refreshing: false, // 下拉刷新状态，true为刷新中，此时showHeight == viewHeight
        loadMore: 0, // 加载更多的状态，-1为加载中，1为可加载更多，0为不可加载更多（此时加载更多视图不可视，并再无此事件）
        canLoadMore: true, //
    }
  },
  watch: {
    hasMore (newVal) {
      this.loadMore = newVal;
      return newVal;
    }
  },
  mounted: function() {
      this.interval = setInterval(() => {
          if (this.showHeight) {
              let lingthDot = this.lingthDot;
              lingthDot += 1;
              this.lingthDot = lingthDot;
          }
      }, 300);
  },
  beforeDestroy: function() {
      clearInterval(this.interval);
  },
  methods: {
      /**
       * 下拉刷新事件：
       *  _start     设置初始触碰的位置信息
       *  _move      获取滑动时触碰的位置信息，设置刷新视图高度
       *  _end       获取触碰结束位置信息，判断是否需要触发刷新事件（refresh）
       *  _scroll    设置scrollY，scrollY为0的时候，才能触发刷新视图
       *  _toupper   scroll事件概率出现滑动到顶部的时候最后一个scrollTop不是0，所以添加upper事件作为确保滑动到顶部设置scrollY为0
       *
       * 上拉加载更多
       *  _tolower  视图滑动到底部触发加载更多事件（loadMore）
       *
       * 备注：(触发事件)
       *  refresh     该事件触发后需要回调，通过回调刷新视图
       *  loadMore    该事件触发后可不回调，通过设置loadMore的值，修改视图的展示
       */
      _start: function(e) {
          let { showHeight } = this;
          let { touches } = e;
          this.end =  false;
          this.startTouch =  true;
          this.touching =  true;
          if (this.scrollY == 0) {
            this.startX =  touches[0].pageX;
            this.startY =  touches[0].pageY - showHeight;
          }
      },
      _move: function(e) {
          let {
              startTouch,
              scrollY,
              startY,
              startX,
              touching,
              showHeight
          } = this;
          let { touches } = e;
          let nextX = touches[0].pageX;
          let nextY = touches[0].pageY;

          if (!startX) {
            return ;
          }

          if (!startX && !scrollY) {
            this.startX =  touches[0].pageX;
            this.startY =  touches[0].pageY - showHeight;
            return ;
          }

          // 初始操作时侧滑禁止使用下拉刷新
          if (
              !touching ||
              (startTouch &&
                  Math.abs(nextX - startX) > Math.abs(nextY - startY))
          ) {
              this.touching = false;
              this.startTouch = false;
              return;
          }

          /**
           * 上滑操作，viewHeight视图高度不断减少，最少为0
           * 下拉操作，viewHeight视图高度不断增加
           */
          let nextHeight = nextY - startY;
          nextHeight = nextHeight < 0 ? 0 : nextHeight;

          // scrollY == 0 的时候，视图在最顶端，可下拉增加高度，展示刷新视图
          if (scrollY == 0) {
            showHeight = nextHeight;
          }

          this.showHeight = showHeight;
          this.startTouch = false;
          return e;
      },
      _end: function() {
          let {
              showHeight,
              refreshing,
              viewHeight,
              loadMore,
              scrollY
          } = this;
          if (scrollY == 0) {
              /**
               * 刷新视图展示高度showHeight >= viewHeight时，刷新视图回滚到设定的高度viewHeight，为刷新状态，并呼起刷新事件
               * 反之，则回滚到0高度，恢复为不刷新状态
               */
              if (showHeight >= viewHeight) {
                  showHeight = viewHeight;
                  this.end = true;
                  this.showHeight = showHeight;
                  if (!refreshing) {
                      this.refreshing = true;
                      /**
                       * 该事件需要回调，回调设置视图回到初始状态
                       */
                      this.$emit('refresh', {});
                  }
              } else {
                  this.end = true;
                  this.showHeight =
                      loadMore == -1 && scrollY <= 0 ? viewHeight : 0;
              }
          }
      },
      _scroll: function(e) {
          let { scrollTop } = e.detail;
          let { showHeight } = this;
          this.scrollY = showHeight ? 0 : scrollTop;
      },
      _toupper: function() {
          this.scrollY = 0
      },
      _tolower: function() {
        console.log(this.loadMore);
          if (this.loadMore === 1) {
              this.$emit('loadMore', '');
          }
      },

      refreshOver: function() {
        this.refreshing = false
        this.end = true
        this.showHeight = 0
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../base.less";

.loadMore {
    display: flex;
    justify-content: center;
    align-items: center;
    color: @color-99;

    > view:first-child {
        padding: @space-30;
    }

    text {
        vertical-align: middle;
        margin-left: 10rpx;
    }
}

.loading {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    animation: weuiLoading 1s steps(12, end) infinite;
    background: transparent
        url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iciIgd2lkdGg9JzEyMHB4JyBoZWlnaHQ9JzEyMHB4JyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBjbGFzcz0iYmsiPjwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjRTlFOUU5JwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoMCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICA8L3JlY3Q+CiAgICA8cmVjdCB4PSc0Ni41JyB5PSc0MCcgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHJ4PSc1JyByeT0nNScgZmlsbD0nIzk4OTY5NycKICAgICAgICAgIHRyYW5zZm9ybT0ncm90YXRlKDMwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4KICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyM5Qjk5OUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz4KICAgIDwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjQTNBMUEyJwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoOTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNBQkE5QUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCMkIyQjInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxNTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCQUI4QjknCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDMkMwQzEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyMTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDQkNCQ0InCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEMkQyRDInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEQURBREEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNFMkUyRTInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0Pgo8L3N2Zz4=')
        no-repeat;
    -webkit-background-size: 100%;
    background-size: 100%;
}

.header {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
}

.dots {
    display: flex;
    justify-content: center;
    align-items: center;

    > view {
        background: gray;
        border-radius: 50%;
        height: 15rpx;
        width: 15rpx;
        margin: 0 10rpx;
    }
}

</style>
