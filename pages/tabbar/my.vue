<template>
	<view class="main">
		<view v-if="userStore.loginStatus">
			<view class="my" @click="info()">
				<view class="myAvatar">
					<img :src="userStore.userInfo.avatar_path?userStore.userInfo.avatar_path:'/static/img/avatar.png'" alt="">
				</view>
				<view class="myInfo">
					<view class="myName">{{userStore.userInfo.nickname}}</view>
					<view class="myName">Id:{{userStore.userInfo.uuid}}</view>
				</view>
			</view>
			
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
			})
	const login = ()=>{
		uni.navigateTo({
			url: '/pages/tabbar/login'
		});
	}
	function info(){
		uni.navigateTo({
			url: '/pages/my/info/index'
		});
	}
</script>

<style lang="scss" scoped>
	.my{
		display: flex;
		background-color: #fff;
		padding: 40rpx;
		box-sizing: border-box;
		.myAvatar{
			width: 100rpx;
			height: 100rpx;
			margin-right: 20rpx;
			border-radius: 10rpx;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.myInfo{
			width: calc(100% - 120rpx);
			.myName{
				
			}
		}
	}
</style>
