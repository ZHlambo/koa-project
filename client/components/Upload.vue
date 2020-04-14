<template>
  <view class="imageList">
    <view class="count" v-for="(item, index) in imgs" :key="index">
      <image :src="item"></image>
    </view>
    <view v-if="imgs.length < count" @click="tapUpload">
      <image src="/static/img/m/upload.png"></image>
    </view>
  </view>
</template>

<script>
export default {
    name: "Upload",
    props: {
      count: {
          type: Number,
          default: 3
      },
      srcs: {
          type: Array,
          default: []
      },
    },
    data () {
      return {
          progress: 0,
          imgs: []
      };
    },
    methods: {
      tapUpload () {
        let {count, imgs} = this;
        let Upload = this.$utils.upload;
        uni.chooseImage({
            count,
            success: e => {
                let tempFilePaths = e.tempFilePaths;
                if (!tempFilePaths || !tempFilePaths[0]) {
                    return;
                }

                // 先设置_src为上传的图片，若外部更改了src为相同，则不会再上传
                this.imgs = imgs.concat(tempFilePaths);

                // 通知外部，图片正在上传中
                this.$emit('upload', {srcs: imgs.concat(tempFilePaths)});
                let count = imgs.length;
                for (let i = 0; i < tempFilePaths.length; i++) {
                  new Upload(tempFilePaths[i], src => {
                    this.imgs.splice(i+count, 1, src);
                    this.$emit('upload', {srcs: this.imgs});
                  }, fail => {
                    // console.log(fail);
                  }, progress => {
                    // console.log(progress);
                  });
                }
            }
        });
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../base.less";

.imageList {
    display: flex;
    flex-wrap: wrap;
    >view {
      margin-right: @space-10;
      margin-bottom: @space-10;
    }
}

.imageItem {
    position: relative;
    margin: 0 20rpx 20rpx 0;
    width: 140rpx;
    height: 140rpx;

    .delete {
        position: absolute;
        top: -12rpx;
        right: -12rpx;
        line-height: 30rpx;
        width: 28rpx;
        height: 28rpx;
        text-align: center;
        font-weight: bold;
        color: white;
        background: red;
        border-radius: 50%;
    }
}


image {
  width: 110rpx;
  height: 110rpx;
}

</style>
