<template>
	<view class="layout">
		
		<view class="main ">
			<scroll-view scroll-y="true" class="friendScroll" @scrolltolower="lower">
			<view class="friendList">
				<view class="friendUl">
					<view class="friendLi" @click="friendNew()">
						<view class="friendAvatar"><image :src="Avatar" alt=""></image></view>
						<view class="friendName">新的朋友</view>
						<view class="friendNewNum">
							<view v-if="data.friendNewNum>99" class="no_read_num">99+</view>
							<view v-else-if="data.friendNewNum<99 && data.friendNewNum>0" class="no_read_num">{{data.friendNewNum}}</view>
						</view>
					</view>
					<view class="friendLi" @click="group()">
						<view class="friendAvatar"><image :src="Avatar" alt=""></image></view>
						<view class="friendName">群聊</view>
					</view>
				</view>
			</view>
			<view class="friendList ">
				<view class="friendListGroup" v-for="(val,key,index) in data.friendListGroup" :key="index">
					<view class="friendListGroupKey">{{key}}</view>
					<view class="friendUl">
						<navigator v-for="(item,index1) in val" :key="index1" :url="'/pages/friend/profile?uid='+item.friend_uid">
							<view class="friendLi">
								<view class="friendAvatar"><image :src="item.FriendUser.avatar_path?item.FriendUser.avatar_path:Avatar" alt=""></image></view>
								<view class="friendName">
									<view>{{item.FriendUser.nickname}}</view>
									<view v-if="item.remarks!=item.FriendUser.nickname" class="friendNameNote">{{item.remarks}}</view>
								</view>
							</view>
						</navigator>
					</view>
				</view>
			</view>
			</scroll-view>
		</view>
		<ActionMenu :action_menu="data.action_menu"></ActionMenu> 
	</view>
</template>

<script setup>
	import {reactive} from 'vue'
	import ActionMenu from '@/components/common/ActionMenu.vue'
	import { onReady,onLoad,onShow,onHide,onNavigationBarButtonTap,onPullDownRefresh,onUnload } from '@dcloudio/uni-app'
	import { request } from '@/utils/request.js';
	import { Avatar } from '@/config/index.js';
	import { useUserStore } from '@/store/user'
	import Cache from '@/utils/cache.js'
	import _get from '@/chat/_get.js'
	import friendObj from '@/chat/friend.js'
	const userStore = useUserStore()

	const data = reactive({
				formData:{
					id:'',
				},
				friendListGroup :{},
				page_size:40,
				page:1,
				pages:1,
				action_menu:false,
				friendNewNum:0,
			})
			
	onLoad(()=>{
	})
			
	onNavigationBarButtonTap(e=>{
		data.action_menu = !data.action_menu
	})
	
	onPullDownRefresh(()=>{
		Cache.localData('friend',null)
		uni.stopPullDownRefresh();
	})
	
	async function lower(e) {
		if(data.page < data.pages){
			data.page = data.page+1
			let getFriendArr = await _get.getFriend({page:data.page,
				page_size:data.page_size});
			if(getFriendArr){
				let friend =  friendObj.friendAddByPage(getFriendArr[0])
				data.friendListGroup = friendObj.friendGroup(friend)
				data.pages = getFriendArr[1]
			}
		}
	}
			
	onShow(async() => {
		uni.$on('friend_new_num',function(friendNewNum){
			data.friendNewNum=friendNewNum
		});
		
		uni.$on('friend',function(friend){
			data.friendListGroup = friendObj.friendGroup(friend)
		});
		
		let friend = Cache.localData('friend')
		if(friend.length>0){
			data.friendListGroup = friendObj.friendGroup(friend)
		}else{
			let getFriendArr = await _get.getFriend();
			if(getFriendArr){
				data.friendListGroup = friendObj.friendGroup(getFriendArr[0])
				data.pages = getFriendArr[1]
			}
		}
		let friendNewNum = Cache.localData('friendNewNum')
		if(friendNewNum){
			data.friendNewNum = friendNewNum
		}else{
			data.friendNewNum = 0
		}
	})
	
	onHide(() => {
		uni.$off('friend');
		uni.$off('friend_new_num');
	})
	
	onUnload(() => {
		uni.$off('friend');
		uni.$off('friend_new_num');
	})

	function friendNew(){
		uni.navigateTo({url: '/pages/friend/new'})
	}
	
	function group(){
		uni.navigateTo({url: '/pages/group/list'})
	}
	
	
</script>

<style lang="scss" scoped>
	.friendScroll{
	}
	
	.friendList{
		.friendListGroupKey{
			padding: 0 20rpx;
			box-sizing: border-box;
			font-size: 24rpx;
			line-height: 50rpx;
			height: 50rpx;
			color:#999;
		}
		.friendUl{
			width: 100%;
			padding:20rpx 0;
			box-sizing: border-box;
			background-color: #fff;
			.friendLi{
				display: flex;
				align-items: center;
				padding: 0 20rpx;
				.friendAvatar{
					width: 70rpx;
					height: 70rpx;
					padding:10rpx;
					margin-right: 20rpx;
					image{
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
				.friendName{
					flex-grow: 1;
					overflow: hidden;
					border-bottom: 1rpx solid #fafafa;
					display: flex;
					flex-direction: column;
					justify-content: center;
					height: 89rpx;
					overflow: hidden;
					.friendNameNote{
						color:#666;
						font-size: 20rpx;
					}
				}
				.friendNewNum{
					display: flex;
					justify-content: center;
					width: 100rpx;
				}
			}
		}
		
	}

</style>
