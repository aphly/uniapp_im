<template>
	<view class="main">
		<view class="text-area">
			<text class="title">{{ data.title}}</text>
		</view>
		
		<view v-for="(item,index) in data.unilist" :key="index">
			<view>{{item.title}}</view>
		</view>
		<TabBar currPath='pages/tabbar/cart'></TabBar>
	</view>
</template>

<script setup>
	import {reactive} from 'vue'
	import TabBar from '@/components/common/TabBar.vue'
	import { onReady } from '@dcloudio/uni-app'
	import { request } from '@/utils/request.js';
	const data = reactive({
				title: '信息',
				list:["a","b",'c'],
				count:0,
				unilist:[]
			})
	onReady(() => {
		request({
			url:'/v1/t1'
		}).then((res)=>{
			console.log(res)
			data.unilist = res.data.list
		})
		console.log('onReady')
	})
</script>

<style>
</style>
