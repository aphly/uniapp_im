<template>
	<view class="main">
		<view class="text-area">
			<text class="title">{{ data.title}}</text>
		</view>
		
		<view v-for="(item,index) in data.unilist" :key="index">
			<view>{{item.title}}</view>
		</view>
		
		<view class="send_box">
			<view class="send_input">
				<input class="send_input1" type="text" v-model="data.message">
			</view>
			
			<view class="send_btn" @click="sendMsg" >发送</view>
		</view>
	</view>
</template>

<script setup>
	import {reactive} from 'vue'
	import { onReady,onLoad } from '@dcloudio/uni-app'
	import { request } from '@/utils/request.js';
	import { useUserStore } from '@/store/user'
	//import wsRequest from '@/utils/websocket.js'
	const userStore = useUserStore()
	const data = reactive({
				title: "聊天",
				list:["a","b",'c'],
				ws: null,
				friend_uuid:'',
				message:''
			})
	onLoad((option) => {
		data.friend_uuid = option.friend_uuid
		var wsUrl = 'ws://localhost:8080/v1/chat_message?friend_uuid='+option.friend_uuid+'&token='+userStore.accessToken
		data.ws = uni.connectSocket({
			url: wsUrl,
			complete: ()=> {}
		});
		data.ws.onOpen((res)=>{
			console.log("onOpen",res)
		})
		data.ws.onMessage((res)=>{
			console.log("onMessage",res)
		})
		data.ws.onClose((res)=>{
			console.log("onClose",res)
		})
		data.ws.onError((res)=>{
			console.log("onError",res)
		})
	})
	
	onReady(() => {
		console.log('onReady')
	})
	function watchSocket() {
		this.ws.getMessage(opt => {
			console.warn("消息接收：", opt);
		})
	}
	function sendMsg(){
		var message = {uuid:userStore.userInfo.uuid,msg_type:1,to_id:data.friend_uuid,message:data.message}
		var messageData ={
			act:"log",
			logData:""
		}
		messageData ={
			act:"send",
			data:message
		}
		data.ws.send({
			data:JSON.stringify(messageData),
			success:(res)=>{
				console.log(res)
			}
		});
	}		
</script>

<style lang="scss">
.send_box{
	position: fixed;    background: #f9f9f9;padding: 5px;
	width: 100%;    bottom: 0;
	display: flex;
	.send_input{
		width: calc(100% - 110px);
		.send_input1{
			background: #fff;    min-height: 40px;
		}
	}
	.send_btn{
		width: 90px;
		margin-left: 10px;text-align: center;border-radius: 4px;
		line-height: 40px;
		background: #d33e3e;
		color: #fff;
	}
}
</style>
