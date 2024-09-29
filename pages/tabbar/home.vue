<template>
	<view class="main">
		<view>asdasdsd</view>
		<view class="uni app-lajixiang"></view>
		<view class="text-area">
			<text class="title">{{ data.title}}</text>
		</view>
		<view v-for="item,index in data.list" :key="index">{{item}}</view>
		<view>{{data.count}}</view>
		<button @click="tiaoz">跳转</button>
		<view v-for="item,index in data.unilist" :key="index">{{item.title}}</view>
		<TabBar currPath='pages/tabbar/home'></TabBar>
	</view>
</template>

<script setup>
	import {reactive} from 'vue'
	import TabBar from '@/components/common/TabBar.vue'
	import { onShow,onReady } from '@dcloudio/uni-app'
	
	const data = reactive({
				title: 'Home',
				list:["a","b",'c'],
				count:0,
				unilist:[]
			})
	function tiaoz(){
		data.count++;
		console.log('xxxx')
	}
	onShow(() => {
	  console.log('onShow')
	})
	
</script>

<style>
</style>
