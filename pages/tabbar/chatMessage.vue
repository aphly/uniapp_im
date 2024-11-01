<template>
	<view class="main">
		<view class="msg_fixed ">
			<scroll-view scroll-y="true"  scroll-with-animation :scroll-into-view="id"
					:refresher-enabled="btnData.isOpenRefresh" refresher-background="transparent"
					:refresher-triggered="btnData.triggered" @refresherrefresh="getMessageList"
				 class="msg_ul" :style="{height:'calc(100% - '+cssData.send_fixed_height+'rpx)'}">
				<view v-if="!btnData.isOpenRefresh" class="nothing">没有更多了~</view>
				<MessageList :messageList="messageList" :friend_uuid="pageData.friend_uuid" />
			</scroll-view>
			<view class="send_fixed" :style="{height:cssData.send_fixed_height+'rpx'}">
				<view ref="send_box"  :class="{send_box:true,in_input:classData.in_input}">
					<view class="send_input">
						<textarea class="send_textarea" :style="{height:cssData.send_textarea_height}" 
						:auto-height="true" v-model="message" @linechange="textareaLine"></textarea>
					</view>
					<view class="uniapp_box" @click="tabType(1)">
						<view v-show="!btnData.emoji" class="uniapp icon-xiaolian"></view>
						<view v-show="btnData.emoji" class="uniapp icon-jianpan"></view>
					</view>
					<view class="send_btn" @click="sendMsg" >发送</view>
					<view @click="tabType(2)" class="uniapp_box send_type_btn">
						<view v-show="!btnData.sendType" class="uniapp icon-jiahao"></view>
						<view v-show="btnData.sendType" class="uniapp icon-Close"></view>
					</view>
				</view>
				<Emoji v-show="btnData.emoji" class="send_emoji" @FromChild = "receiveEmoji"></Emoji>
				<view v-show="btnData.sendType" class="send_type">
					<view class="send_type_item" @click="chooseImg(1)">
						<view class="send_type_itemx">
							<view class="uniapp icon-ziyuan"></view>
						</view>
					</view>
					<view class="send_type_item" @click="chooseImg(2)">
						<view class="send_type_itemx">
							<view class="uniapp icon-paishexuanzhong1"></view>
						</view>
					</view>
					<view class="send_type_item">
						<view class="send_type_itemx">
							<view class="uniapp icon-wenjian"></view>
						</view>
					</view>
					<view class="send_type_item">
						<view class="send_type_itemx">
							<view class="uniapp icon-weizhi"></view>
						</view>
					</view>
					
					<view class="send_type_item">
						<view class="send_type_itemx">
							<view class="uniapp icon-video"></view>
						</view>
					</view>
					<view class="send_type_item">
						<view class="send_type_itemx">
							<view class="uniapp icon-shengyinbofang"></view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script setup>
	import {reactive,watch,nextTick,ref} from 'vue'
	import { onReady,onLoad,onShow } from '@dcloudio/uni-app'
	import { generateRandStr,objEqual } from '@/helper/func.js';
	import { useUserStore } from '@/store/user'
	import {WsHOST} from "@/config/index.js"
	import Emoji from '@/components/common/Emoji.vue'
	import MessageList from '@/components/common/MessageList.vue'
	import {upload} from "@/utils/request.js"
	const userStore = useUserStore()
	
	let id = ref('item_init')

	const pageData = reactive({
		title: "聊天",
		ws: null,
		wsUrl:'',
		friend_uuid:'',
		chat_id:0,
	});
	
	const message = ref("")
	
	const messageList = ref([])
	
	const data = reactive({
		listTimestamp:0,
		page:1,
		pages:1,
	});
			
	const cssData = reactive({
		scrollHeight:0,
		send_fixed_height:92,
		send_textarea_height:92
	});	
	
	const classData = reactive({
		in_input:false,
	});	
		
	const btnData = reactive({
		triggered:false,
		isOpenRefresh: false,
		emoji:false,
		sendType:false,
	});
			
	onLoad((option) => {
		pageData.friend_uuid = option.friend_uuid
		pageData.wsUrl = WsHOST+'/v1/chat_message?friend_uuid='+option.friend_uuid+'&token='+userStore.accessToken
		connectWebSocket()
	})
	
	function chooseImg(type){
		let sourceType = [];
		if(type==1){
			sourceType = ['album']
		}else{
			sourceType = ['camera']
		}
		uni.chooseImage({
			count: 1,
			type:"image",
			sizeType: ['original', 'compressed'],
			sourceType,
			success: async (chooseImageRes) => {
				const tempFilePaths = chooseImageRes.tempFilePaths;
				const uploadFileRes = await upload({
					url:'/v1/chat_image',
					filePath: tempFilePaths[0],
				})
				let res = JSON.parse(uploadFileRes)
				if(!res.code){
					console.log(res.data)
					var messageData ={
						act:"send",
						data:{
							msg_type:2,
							message:"",
							js_id:generateRandStr(),
							pic:res.data.image
						}
					}
					pageData.ws.send({
						data:JSON.stringify(messageData),
						success:(res)=>{
							message.value=""
						}
					});
				}else{
					uni.showToast({
						title: res.msg
					})
				}
			}
		})
	}

	function tabType(type){
		if(type==1){
			btnData.emoji = !btnData.emoji;
			btnData.sendType = false
			if(btnData.emoji){
				cssData.send_fixed_height=600
			}else{
				cssData.send_fixed_height= cssData.send_textarea_height+50
			}
		}else if(type==2){
			btnData.emoji = false;
			btnData.sendType = !btnData.sendType
			if(btnData.sendType){
				cssData.send_fixed_height=600
			}else{
				cssData.send_fixed_height= cssData.send_textarea_height+50
			}
		}
	}
	
	function sendInit(){
		classData.in_input = false
		cssData.send_fixed_height = cssData.send_textarea_height+50
		btnData.emoji = false
	}
	
	function receiveEmoji(payload){
		message.value = message.value+payload
	}
	
	function textareaLine(event){
		cssData.send_textarea_height = event.detail.heightRpx
	}
	
	watch(() => JSON.parse(JSON.stringify(messageList.value)),(newval,oldval)=>{
		nextTick(()=>{
			if(oldval.length==0 || (newval.length-oldval.length==1 && objEqual(newval[0],oldval[0]))){
				id.value = "item_" + (newval.length - 1)
			}
		})
	})
	
	watch(()=>cssData.send_textarea_height,(newval,oldval)=>{
		nextTick(()=>{
			cssData.send_fixed_height = cssData.send_textarea_height+50
		})
	})
	
	watch(message, (newval,oldval)=> {
		if(newval){
			classData.in_input = true
			btnData.sendType=false
		}else{
			sendInit()
		}
	})

	function connectWebSocket(){
		pageData.ws = uni.connectSocket({
			url: pageData.wsUrl,
			complete: ()=> {}
		});
		pageData.ws.onOpen((res)=>{
			console.log("onOpen",res)
		})
		pageData.ws.onMessage((res)=>{
			console.log("onMessage",res)
			if(res.data){
				let jsonData = JSON.parse(res.data)
				if(jsonData.msg_type=="res_list"){
					
					Array.prototype.unshift.apply(messageList.value, jsonData.data);
					
					btnData.triggered=false
					if(jsonData.timestamp){
						data.listTimestamp = jsonData.timestamp
						data.pages = jsonData.pages
						if(data.page<data.pages){
							btnData.isOpenRefresh=true
						}
					}
				}else if(jsonData.msg_type=="res_send"){
					messageList.value.push(jsonData.data)
				}
			}
		})
		pageData.ws.onClose((res)=>{
			console.log("onClose",res)
		})
		pageData.ws.onError((res)=>{
			console.log("onError",res)
		})
	}
	
	function openWs(){
		connectWebSocket()
	}
	
	function closeWs(){
		pageData.ws.close()
	}
	
	onReady(() => {
		console.log('onReady')
	})
	
	onShow(() => {
		switch(pageData.ws.readyState) {
		    case 0:
		      console.log('WebSocket状态：连接中...');
		      break;
		    case 1:
		      console.log('WebSocket状态：已连接');
		      break;
		    case 2:
		      console.log('WebSocket状态：关闭中...');
		      break;
		    case 3:
		      console.log('WebSocket状态：已关闭');
			  connectWebSocket()
		      break;
		  }
		console.log('onShow')
	})
	
	
	function watchSocket() {
		pageData.ws.getMessage(opt => {
			console.warn("消息接收：", opt);
		})
	}
	function sendType(){
		btnData.sendType=!btnData.sendType
	}
	
	function sendMsg(){
		var messageData ={
			act:"send",
			data:{
				msg_type:1,
				message:message.value,
				js_id:generateRandStr()
			}
		}
		pageData.ws.send({
			data:JSON.stringify(messageData),
			success:(res)=>{
				message.value=""
			}
		});
		sendInit()
	}
	
	function getMessageList(){
		data.page = data.page+1;
		if(data.page<=data.pages){
			if(!btnData.triggered){
				btnData.triggered=true
				var messageData ={
					act:"list",
					data:{
						page:data.page,
						timestamp:data.listTimestamp
					}
				}
				pageData.ws.send({
					data:JSON.stringify(messageData),
					success:(res)=>{
						console.log(res)
					}
				});
			}
			if(data.page==data.pages){
				btnData.isOpenRefresh = false
			}
		}else{
			console.log("xxxx",data.page)
		}
		
	}
	
</script>

<style lang="scss" scoped>
	.msg_fixed{
		position: fixed;
		top:0;
		height: 100%;
		bottom: 0;
		width: 100%;
		.msg_ul{
			width: 100%;
			padding:20rpx;
			height: calc(100% - 100rpx);
			overflow-y: auto;
			box-sizing: border-box;
			.nothing{
				text-align: center;
				padding: 20rpx 0;
				color: #999;
			}
		}
		.send_fixed{
			min-height: 90rpx;
			background: #f9f9f9;
			width: 100%;
			.send_box{
				padding: 10rpx;
				width: calc(100% - 20rpx);   
				display: flex;
				border-bottom: 1rpx solid #f9f9f9;
				align-items: center;
				border-bottom:1px solid #eee ;
				.uniapp_box{
					width: 70rpx;height: 70rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0 5rpx;
					.uniapp{font-size: 54rpx;}
				}
				
				.send_input{
					width: calc(100% - 180rpx);
					margin-right: 20rpx;
					.send_textarea{
						background: #fff;
						width: calc(100% - 40rpx);
						padding:14rpx 20rpx;
						overflow-y: auto;
						border-radius: 8rpx;
						// ::v-deep .uni-textarea-textarea{
						// 	padding-top: 16rpx;
						// }
					}
					
				}
				.send_btn{
					width: 120rpx;
					margin-left: 10rpx;
					text-align: center;
					height: 60rpx;
					padding:2rpx;
					line-height: 60rpx;
					background: #d33e3e;
					border-radius: 8rpx;
					color: #fff;
					display: none;
				}
				.send_type_btn{
					display: flex;
				}
			}
			.send_box.in_input{
				.send_input{
					width: calc(100% - 230rpx);
				}
				.send_btn{
					display: block;
				}
				.send_type_btn{
					display: none;
				}
			}
			.send_type{
				display: flex;
				flex-wrap: wrap;
				padding: 40rpx 0 0;
				.send_type_item{
					width: 25%;display: flex;justify-content: center;align-items: center;margin-bottom: 40rpx;
					.send_type_itemx{
						background: #fff;
						padding: 30rpx;
						border-radius: 20rpx;
						.uniapp{
							font-size: 54rpx;
						}
					}
					
				}
			}
		}
	}
	
</style>
