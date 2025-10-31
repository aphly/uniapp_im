<template>
	<view class="layout">
		<view class="main">
			<scroll-view  scroll-y="true" class="" >
				<view class="chatListUl">
					<view v-for="(item,index) in data.chatlist" :key="index" class="chatListLi">
						<navigator class="chatListLiNav" :url="'/pages/chat/message?list_id='+item.list_id">
							<view v-if="!item.list.type" class="chatListLi1">
								<view class="chatListLiAvatar">
									<image :src="friendAvatar(userStore.info.uid,item.list.User)"></image>
									<view v-if="item.no_read_num>99" class="no_read_num no_read_num_p">99+</view>
									<view v-else-if="item.no_read_num<99 && item.no_read_num>0" class="no_read_num no_read_num_p">{{item.no_read_num}}</view>
								</view>
								<view class="chatListLiAvatarR">
									<view class="chatListLiAvatarR1">
										<view class="chatListLiAvatarR11 wenzi">
											{{friendNickname(userStore.info.uid,item.list.User)}}
										</view>
										<view class="chatListLiAvatarR12">
											{{formatChatTime(item.list.last_at)}}
										</view>
									</view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media===0"></view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media==1">{{item.list.last_message}}</view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media==2">[图片]</view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media==3">[音频]</view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media==4">[视频]</view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media==5">[文件]</view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media==6">[地图]</view>
								</view>
							</view>
							<view v-else-if="item.list.type==1"  class="chatListLi1">
								<view class="chatListLiAvatar">
									<GroupAvatar :User="item.list.User" class="GroupAvatar"></GroupAvatar>
									<view v-if="item.no_read_num>99" class="no_read_num no_read_num_p">99+</view>
									<view v-else-if="item.no_read_num<99 && item.no_read_num>0" class="no_read_num no_read_num_p">{{item.no_read_num}}</view>
								</view>
								<view class="chatListLiAvatarR">
									<view class="chatListLiAvatarR1">
										<view class="chatListLiAvatarR11 wenzi">
											{{groupName(item.list.name,item.list.User)}}
										</view>
										<view class="chatListLiAvatarR12">
											{{formatChatTime(item.list.last_at)}}
										</view>
									</view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media===0"></view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media==1">{{item.list.last_message}}</view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media==2">[图片]</view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media==3">[音频]</view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media==4">[视频]</view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media==5">[文件]</view>
									<view class="chatListLiAvatarR2" v-if="item.list.last_media==6">[地图]</view>
								</view>
							</view>
						</navigator>
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
	import GroupAvatar from '@/components/common/GroupAvatar.vue'
	import { onReady,onLoad,onShow,onHide,onUnload,onNavigationBarButtonTap} from '@dcloudio/uni-app'
	import { Avatar } from '@/config/index.js';
	import { useUserStore } from '@/store/user.js'
	const userStore = useUserStore()
	import _get from '@/chat/_get.js'
	import Cache from '@/utils/cache.js'
	import { useWsStore } from '@/store/ws.js'
	const wsStore = useWsStore()

	const data = reactive({
			chatlist:[],
			action_menu:false
		})
	
	onNavigationBarButtonTap(e=>{
		data.action_menu = !data.action_menu
	})
	
	function friendAvatar(meUid,Users){
		let avatar_path = Avatar
		Users.forEach(i=>{
			if(i.uid!=meUid){
				avatar_path= i.avatar_path?i.avatar_path:Avatar
			}
		})
		return avatar_path
	}
	
	function friendNickname(meUid,Users){
		let nickname =''
		Users.forEach(i=>{
			if(i.uid!=meUid){
				nickname = i.nickname
			}
		})
		return nickname
	}
	
	function groupName(name,Users){
		if(name){
			return name
		}
		let name_arr =[]
		Users.forEach(i=>{
			name_arr.push(i['nickname'])
		})
		return name_arr.join("、")
	}
	
	onShow(async () => {
		setTimeout(()=>{
			var messageData ={
				route:"offlineChatList",
				body:JSON.stringify({
					uid:userStore.info.uid
				})
			}
			wsStore.Send(messageData,function(){
				console.log("获取离线列表")
			})
		},1000)
		
		uni.$on('offline_chat_list',function(chat_list){
			data.chatlist = sort(chat_list)
		});
		
		uni.$on('chat_list',function(chat_list){
			data.chatlist = sort(chat_list)
		});
		
		await _get.getChatNeedList()
		
		let chat_list = Cache.localData('chat_list')
		if(chat_list.length>0){
			data.chatlist = sort(chat_list)
		}
	})
	
	function sort(chat_list){
		if(!chat_list || chat_list.length===0){
			return []
		}
		let top = []
		let noTop = []
		chat_list.forEach(i=>{
			if(i.top==1){
				top.push(i)
			}else{
				noTop.push(i)
			}
		})
		top.sort((a, b) => b.list.last_at - a.list.last_at);
		noTop.sort((a, b) => b.list.last_at - a.list.last_at);
		return [...top,...noTop]
	}

	onHide(() => {
		uni.$off('offline_chat_list');
		uni.$off('chat_list');
	})
	
	onUnload(() => {
		uni.$off('offline_chat_list');
		uni.$off('chat_list');
	})
	
	function formatChatTime(time) {
		if(isNaN(time)){
			return
		}
		time = time*1000
		time = dateFormat("YY-mm-dd HH:MM:SS", new Date(time));
		var date = time.toString();
		var year = date.split("-")[0];
		var month = date.split("-")[1];
		var day = date.split("-")[2];
		var d1 = new Date(year + '/' + month + '/' + day.split(" ")[0]);
		var d3 = new Date(date.replace(/-/g, "/"));
		var dd = new Date();
		var y = dd.getFullYear();
		var m = dd.getMonth() + 1;
		var d = dd.getDate();
		var d2 = new Date(y + '/' + m + '/' + d);
		var iday = parseInt(d2 - d1) / 1000 / 60 / 60 / 24;
		var hours = d3.getHours();
		var minutes = d3.getMinutes();
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		if (hours < 10) {
			hours = '0' + hours;
		}
		if (iday == 0) {
			if (hours >= 12) {
				return  hours + ":" + minutes;
			} else {
				return hours + ":" + minutes;;
			}
		} else if (iday == 1) {
			var dt = "";
			if (hours >= 12) {
				dt =  hours + ":" + minutes;
			} else {
				dt =  hours + ":" + minutes;;
			}
			return "昨天 " + dt;
		} else if (iday == 2) {
			var dt = "";
			if (hours >= 12) {
				dt =  hours + ":" + minutes;
			} else {
				dt =  hours + ":" + minutes;;
			}
			return "前天 " + dt;
		} else {
			return year + '/' + month + "/" + d1.getDate()
		}
	}
	
	function dateFormat(fmt, date) {
		let ret;
		const opt = {
			"Y+": date.getFullYear().toString(), // 年
			"m+": (date.getMonth() + 1).toString(), // 月
			"d+": date.getDate().toString(), // 日
			"H+": date.getHours().toString(), // 时
			"M+": date.getMinutes().toString(), // 分
			"S+": date.getSeconds().toString() // 秒
		};
		for (let k in opt) {
			ret = new RegExp("(" + k + ")").exec(fmt);
			if (ret) {
				fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
			};
		};
		return fmt;
	}
</script>

<style lang="scss" scoped>
	.main{
		background-color: #fff;
	}
	.chatListUl{
		.chatListLi{
			.chatListLiNav{}
			.chatListLi1{
				display: flex;
				.chatListLiAvatar{
					width: 90rpx;
					height: 90rpx;
					padding:10rpx;
					margin-right: 20rpx;
					position: relative;
					overflow: hidden;
					flex-shrink: 0;
					image{
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
					.GroupAvatar{
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
				.chatListLiAvatarR{
					border-bottom: 2rpx solid #f1f1f1;
					flex-grow: 1;
					overflow: hidden;
					display: flex;
					flex-direction: column;
					justify-content: center;
					height: 99rpx;
					padding: 10rpx 0;
					overflow: hidden;
					.chatListLiAvatarR2{
						color:#999;
						font-size: 20rpx;
					}
				}
			}
		}
		
	}
	.chatListLiAvatarR1{
		display: flex;
		justify-content: space-between;
		.chatListLiAvatarR11{
			flex-grow: 1;
		}
		.chatListLiAvatarR12{
			font-size: 24rpx;
			color:#999;
			margin-right: 10rpx;
			width: 200rpx;
			flex-shrink: 0;
			text-align: right;
		}
	}
	
</style>
