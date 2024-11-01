<template>
	<view class="main">
		<view>
			<ul>
				<li @click="tz">头像</li>
				<li @click="tz1">昵称</li>
				<li @click="tz2">图片</li>
				<li @click="tz2">test</li>
			</ul>
		</view>
		<view @click="logout">退出</view>
	</view>
</template>

<script setup>
	import {reactive} from 'vue'
	import { useUserStore } from '@/store/user'
	const userStore = useUserStore()
	const data = reactive({
				title: '设置',
			})
			
	function logout(){
		userStore.logout()
		uni.reLaunch({
			url:'/pages/tabbar/home'
		})
	}
	
	function tz(){
		uni.navigateTo({
			url:'/pages/my/setting/avatar'
		})
	}
	function tz1(){
		uni.navigateTo({
			url:'/pages/my/setting/avatar1'
		})
	}
	function tz2(){
		uni.navigateTo({
			url:'/pages/my/setting/test1'
		})
	}
</script>

<style>
	
</style>
