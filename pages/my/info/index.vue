<template>
	<view class="main">
		<view>
			<ul>
				<li @click="avatar">头像</li>
				<li @click="nickName">昵称</li>
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
				title: '个人信息',
			})
	function avatar(){
		uni.navigateTo({
			url:'/pages/my/info/avatar'
		})
	}
	function nickName(){
		uni.navigateTo({
			url:'/pages/my/info/nickName'
		})
	}
	
</script>

<style>
	
</style>
