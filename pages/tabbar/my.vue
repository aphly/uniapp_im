<template>
	<view class="main">
		<view v-if="userStore.loginStatus">
			登录 了
			<view>{{userStore.userInfo.nickname}}</view>
			<view @click="tz()">个人中心</view>
		</view>
		<view v-else>
			<view class="text-area">
				<text class="title">{{data.title}}</text>
			</view>
			<button @click="login">登录/注册</button>
		</view>
		<TabBar currPath='pages/tabbar/my'></TabBar>
	</view>
</template>

<script setup>
	import {reactive} from 'vue'
	import { useUserStore } from '@/store/user'
	import TabBar from '@/components/common/TabBar.vue'
	const userStore = useUserStore()
	const data = reactive({
				title: 'Home',
				list:["a","b",'c'],
				count:0,
				unilist:[]
			})
	
	const login = ()=>{
		uni.navigateTo({
			url: '/pages/tabbar/login'
		});
	}
	function tz(){
		uni.navigateTo({
			url: '/pages/my/setting/index'
		});
	}
</script>

<style>
	
</style>
