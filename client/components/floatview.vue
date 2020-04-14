<template>
	<view>
		<view>
			<view id="floatIcon" class="floatIcon" :class="unfold ? 'unfold': ''">
				<view class="icon" @click="clickFold">
					<image :class="unfold ? 'unfold' :''" src="/static/img/m/icon_float_fold.png" />
					<text>{{unfold ? "收起" : "快捷导航"}}</text>
				</view>
				<view class="menu">
					<span class="line"> </span>
					<view class="" @click="goCenter">
						<image src="/static/img/m/icon_float_personal.png" />
						<view>个人中心</view>
					</view>
					<view class="" @click="goOrders">
						<image src="/static/img/m/icon_float_order.png" />
						<view>订单管理</view>
					</view>
				</view>
			</view>

			<!-- <view class="top" wx:if="{{show}}" bindtap="clickToTop">
    <image src="/images/m/icon_float_to_top.png"/>
  </view> -->
		</view>

	</view>
</template>

<script>
	export default {
		props: ['page'],
		data() {
			return {
				show: false,
				unfold: false,
			}
		},
		methods: {
			islogin() {
				let user = wx.getStorageSync("user");
				return user && user.uuid;
			},
			clickFold() {
				console.log(111)
				wx.reportAnalytics("navigator", {
					page: this.page,
					click: this.unfold ? "折叠" : "展开",
					is_login: this.islogin() ? "登录" : "未登录",
					login_success: "",
				});

				this.unfold = !this.unfold;

			},
			goCenter() {
				let obj = {
					page: this.page,
					click: "个人中心",
					is_login: this.islogin() ? "登录" : "未登录",
					login_success: "",
				};
				wx.reportAnalytics("navigator", obj);
				if (obj.is_login == "未登录") {
					uni.setStorageSync('reportData', obj)
					// getApp().globalData.reportData = obj
				}
				this.goRouter({
					url: "/pages/my-center/index",
				})
			},
			goOrders() {
				let obj = {
					page: this.page,
					click: "订单管理",
					is_login: this.islogin() ? "登录" : "未登录",
					login_success: "",
				};
				wx.reportAnalytics("navigator", obj);
				if (obj.is_login == "未登录") {
					uni.setStorageSync('reportData', obj)
					// getApp().globalData.reportData = obj
				}
				this.goRouter({
					url: "/pages/orders/index",
				})
			},
		}
	}
</script>

<style scoped>
	.floatIcon {
		position: fixed;
		z-index: 1;
		right: 0rpx;
		bottom: 214rpx;
		transition: transform .3s;
		transform: translateX(calc(100% - 104rpx));
		display: flex;
		align-items: center;
	}

	.floatIcon .icon {
		display: inline-block;
		width: 104rpx;
		height: 88rpx;
		padding: 0 16rpx;
		background: rgba(0, 0, 0, .6);
		border-radius: 88rpx 0 0 88rpx;
		color: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.icon>image {
		width: 24rpx;
		height: 20rpx;
		transform: rotate(180deg);
	}

	.icon>image.unfold {
		transform: rotate(0);
	}

	.icon>text {
		display: inline-block;
		font-size: 20rpx;
		width: 44rpx;
		text-align: right;
	}

	.floatIcon .menu {
		display: flex;
		background: rgba(0, 0, 0, .6);
		color: white;
		font-size: 18rpx;
		height: 88rpx;
		padding: 16rpx 0;
		display: flex;
		align-items: center;
		text-align: center;
		box-sizing: border-box;
	}

	.floatIcon .menu>view {
		padding-left: 20rpx;
	}

	.floatIcon .menu>view:last-child {
		padding-right: 20rpx;
	}

	.floatIcon .menu image {
		width: 36rpx;
		height: 36rpx;
	}

	.unfold {
		transform: translateX(0);
	}

	.line {
		display: block;
		content: " ";
		background: white;
		height: 56rpx;
		width: 1rpx;
	}

	.top {
		position: fixed;
		right: 0;
		padding: 10rpx;
		margin: 10rpx;
		background: rgba(0, 0, 0, .6);
		color: white;
		bottom: 104rpx;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		box-sizing: border-box;
	}

	.top>image {
		width: 100%;
		height: 100%;
		padding: 10rpx;
		box-sizing: border-box;
	}
</style>
