<script>
	export default {
		globalData: {
			getAudio: () => {
				let audio = getApp().globalData.audio;
				if (!audio) {
					audio = wx.createInnerAudioContext("audioCtx");
				}
				getApp().globalData.audio = audio;
				return audio;
			}
		},
		onLaunch: function() {
			console.log('App Launch11')
		},
		onShow: function() {
			var that = this;
			// uni.login({
			// 	success(res) {
			// 		console.log(this)
			// 		var type = that.$config.platform == "weixin" ? "miniprogram" : (that.$config.platform == 'douyin' ? "douyin-program" : 'alipay')
			//
			// 		that.$http.post(`${that.$config.host_uc}/api/uc/Oauth2/${type}/getUserId`, {code: res.code}).then((data) => {
			// 			uni.setStorageSync('openid', data.account)
			// 		})
			// 	}
			// })
		},
		onHide: function() {
			console.log('App Hide1')
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	.cell {
		padding: 10rpx 30rpx;
	}

	page {
		font-size: 28rpx;
		color: #333;
		background-color: #fcfcfc;
	}

	.fw {
		font-weight: bold;
	}
	.fl {
		font-size: 32rpx;
	}
	.fn {
		font-size: 28rpx;
	}
	.fm {
		font-size: 24rpx;
	}
	.fs {
		font-size: 20rpx;
	}

	.mb10 {
		margin-bottom: 10rpx;
	}

	.ctheme {
		color: red;
	}
	.c6 {
		color: #666;
	}
	.c9 {
		color: #999;
	}
	.flex {
		display: flex;
		align-items: center;
	}
	.flex1 {
		flex: 1;
	}

	.btn-bottom {
		border-top: 1px solid #ddd;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		display: flex;
		height: 80rpx;
		font-weight: bold;
		>view {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			>button {
				position: absolute;
				width: 100%;
				height: 100%;
				opacity: 0;
				z-index: 1;
			}
		}
		>view:first-child {
			background: white;
		}
		>view:last-child {
			background: red;
			color: white;
		}
	}
	.input {
		display: flex;
		padding: 20rpx 0;
		border-bottom: 1px solid rgba(249,249,249,1);
		&:last-child {
			border-bottom: 0;
		}
		>text {
			min-width: 200rpx;
			max-width: 200rpx;
		}
		>input {
			flex: 1;
			text-align: right;
		}
	}
	.block {
		padding: 0 30rpx;
		background: white;
		margin-bottom: 20rpx;
	}
	.product_icon {
		width: 100rpx;
		height: 100rpx;
	}

</style>
