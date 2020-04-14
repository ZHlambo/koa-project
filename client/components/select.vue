<template>
	<div>
		<view class='color-select'>
		<view v-for="(name,index1) in list" :class="name.check ? 'true' : ''" @click='slecte(item, name.v, ind)' :key="index1">{{name.v}}</view>
		</view>
	</div>
</template>

<script>
	export default {
		props: ['list', 'item', 'ind'],
		methods: {
			slecte(item, name, index) {
				this.$emit('slecte', item, name, index)
			}
		}
	}
</script>

<style scoped>
	.color-select {
		margin-top: 18rpx;
		display: flex;
		flex-wrap: wrap
	}
	.color-select .true {
		background: #FFED4B;
	}
	.color-select view {
		/* width: 115rpx; */
		padding: 0 20rpx;
		height: 66rpx;
		line-height: 66rpx;
		text-align: center;
		border: 1rpx solid rgba(204, 204, 204, 1);
		border-radius: 34rpx;
		margin-right: 30rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Regular;
		font-weight: 400;
		color: rgba(68, 68, 68, 1);
		margin-top: 10rpx;
		min-width: 60rpx;
	}
	
	.color-select view:nth-child(1) {
		margin-left: 0;
	}
</style>
