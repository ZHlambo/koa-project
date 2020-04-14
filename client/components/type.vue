<template>
	<view>
		<text class='type-list' v-for="(child, ind) in list" :key="ind"><text>{{child.name}}:</text><text>{{child.value}}</text></text>
	</view>
	
</template>

<script>
	
	export default {
		props: ['list']
	}
</script>

<style>
</style>
