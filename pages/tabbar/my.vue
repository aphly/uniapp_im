<template>
	<view class="layout">
		<view class="main ">
			<view v-if="userStore.loginStatus">
				<navigator url="/pages/center/profile/index">
					<view class="my">
						<view class="myAvatar">
							<image :src="userStore.info.avatar_path?userStore.info.avatar_path:Avatar" alt=""></image>
						</view>
						<view class="myInfo">
							<view class="myName">{{userStore.info.nickname}}</view>
							<view class="myName_x">
								<view>手机号:{{userStore.getMobile()}}</view>
								<view class="uniapp icon-qianjin1"></view>
							</view>
						</view>
					</view>
				</navigator>
				<view class="my_ul">
					<navigator url="">
						<view class="my_li">
							<view class="uniapp icon-shezhi my_li1"></view>
							<view class="my_li2 single">服务待定</view>
							<view class="uniapp icon-qianjin1"></view>
						</view>
					</navigator>
				</view>
				<view class="my_ul">
					<navigator  url="/pages/center/setting/index">
						<view class="my_li">
							<view class="uniapp icon-shezhi my_li1"></view>
							<view class="my_li2 single">设置</view>
							<view class="uniapp icon-qianjin1"></view>
						</view>
					</navigator>
				</view>
			</view>
			<view v-else>
				<view class="text-area">
					<text class="title">{{data.title}}</text>
				</view>
				<button @click="login">登录/注册</button>
			</view>
		</view>
		<!-- <TabBar currPath='pages/tabbar/my'></TabBar> -->
	</view>
</template>

<script setup>
	import {reactive} from 'vue'
	import { useUserStore } from '@/store/user'
	import TabBar from '@/components/common/TabBar.vue'
	import { Avatar } from '@/config/index.js';
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
	function center(){
		uni.navigateTo({
			url: '/pages/center/index'
		});
	}
	
</script>

<style lang="scss" scoped>
	.my{
		display: flex;
		background-color: #fff;
		padding: 140rpx 20rpx 40rpx;
		box-sizing: border-box;
		.myAvatar{
			width: 120rpx;
			height: 120rpx;
			margin-right: 20rpx;
			image{
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}
		.myInfo{
			width: calc(100% - 140rpx);
			.myName{
				overflow: hidden;
				height: 40rpx;
				line-height: 40rpx;
				margin-top: 10rpx;
				font-size: 36rpx;
				font-weight: 600;
			}
			.myName_x{
				margin-top:28rpx;
				font-size: 24rpx;
				color:#999;
				display: flex;
				justify-content: space-between;
				.icon-qianjin1{
					font-size:24rpx;
					color:#999;
				}
			}
		}
	}
	
</style>
