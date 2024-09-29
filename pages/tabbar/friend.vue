<template>
	<view class="main">
		<form >
			<input type="text" v-model="data.formData.id" placeholder="请输入手机号码" />
		</form>
		<button @click="addFriend" >添加朋友</button>
		
		<view class="">
			好友请求
		</view>
		<view v-for="(item,index) in data.friendRequest" :key="index">
			<view v-if="userStore.userInfo.uuid==item.from_uuid">
				<view>请求{{item.to_name}}</view>
			</view>
			<view v-else>
				<view>来着{{item.from_name}}</view>
			</view>
			<view v-if="item.status==0">
			<button @click="agreeAddFriend(item.id)" >同意</button>
			</view>
			<view v-else>
				已同意
			</view>
		</view>
		
		<view class="">
			好友列表
		</view>
		<view v-for="(item,index) in data.friendList" :key="index">
			<view @click="chat(item.friend_uuid)">
				<view>{{item.FriendUser.nickname}}</view>
			</view>
		</view>
		<TabBar currPath='pages/tabbar/cart'></TabBar>
	</view>
</template>

<script setup>
	import {reactive} from 'vue'
	import TabBar from '@/components/common/TabBar.vue'
	import { onReady } from '@dcloudio/uni-app'
	import { request } from '@/utils/request.js';
	import { useUserStore } from '@/store/user'
	const userStore = useUserStore()
	const data = reactive({
				title: '朋友',
				formData:{
					id:'',
				},
				friendRequest:[],
				friendList:[]
			})
	onReady(async() => {
		let res = await request({
			url:'/v1/friend_request'
		})
		data.friendRequest = res.data.list
		let res1 = await request({
			url:'/v1/friend'
		})
		data.friendList = res1.data.list
		console.log('onReady')
	})
	function addFriend(){
		request({
			url:'/v1/friend_request_add',
			method:"POST",
			data:data.formData,
		}).then((res)=>{
			uni.showToast({
				title:res.msg,
				icon:'none'
			})
		})
	}
	function agreeAddFriend(id){
		request({
			url:'/v1/friend_request_op',
			method:"POST",
			data:{status:1,id},
		}).then((res)=>{
			uni.showToast({
				title:res.msg,
				icon:'none'
			})
		})
	}
	function chat(friend_uuid){
		uni.navigateTo({
			url: '/pages/tabbar/chatMessage?friend_uuid='+friend_uuid
		});
	}
</script>

<style>
</style>
