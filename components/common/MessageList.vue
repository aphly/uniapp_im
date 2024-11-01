<template>
	<view class="scroll-view-item msg_li" v-for="(item,index) in messageList" :key="index" :id="'item_'+index">
		<view v-if="friend_uuid==item.uuid" class="friend_msg">
			<view class="avatar"></view>
			<view class="avatar_brother">
				<view class="avatar_brother_box" v-if="item.msg_type==1">
					{{item.message}}
				</view>
				<view class="avatar_brother_box" v-else-if="item.msg_type==2">
					<img :src="item.pic" alt="">
				</view>
			</view>
		</view>
		<view v-else class="me_msg">
			<view class="avatar">
			</view>
			<view class="avatar_brother">
				<view class="avatar_brother_box" v-if="item.msg_type==1">
					{{item.message}}
				</view>
				<view class="avatar_brother_box avatar_brother_box_img" @click="showPic(item.pic)" v-else-if="item.msg_type==2">
					<img :src="item.pic" alt="">
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {defineProps} from 'vue'
	
	const props = defineProps({
		messageList: Array,
		friend_uuid: String
	});
	
	function showPic(img){
		uni.previewImage({
			urls: [img],
			longPressActions: {
				itemList: ['发送给朋友', '保存图片'],
				success: function(res) {
					if(!res.tapIndex){
						console.log('选中了第' + (res.tapIndex + 1) + '个按钮,第' + (res.index + 1) + '张图片');
					}else if(res.tapIndex==1){
						uni.saveImageToPhotosAlbum({
							filePath: img,
							success: function () {
								uni.showToast({
									title:"保存成功"
								})
							}
						});
					}else{
						console.log(res)
					}
				},
				fail: function(err) {
					console.log(err.errMsg);
				}
			}
		});
	}
	
</script>

<style scoped lang="scss" >
	.msg_li{
		margin-bottom: 20rpx;
		.friend_msg{
			display: flex;
			.avatar{
				width: 80rpx;
				height: 80rpx;
				background-color: #d33e3e;
				border-radius: 12rpx;
			}
			.avatar_brother{
				width: calc(100% - 100rpx);
				margin-left: 20rpx;
				display: flex;
				.avatar_brother_box{
					max-width: 80%;
					background-color: #fff;
					border-radius: 12rpx;
					line-height: 60rpx;
					padding:10rpx 20rpx;
					white-space: pre-wrap;
				}
				.avatar_brother_box.avatar_brother_box_img{
					background-color: transparent;
					padding:10rpx 0;
				}
			}
		}
		.me_msg{
			display: flex;
			flex-direction: row-reverse;
			.avatar{
				width: 80rpx;
				height: 80rpx;
				background-color: #d33e3e;
				border-radius: 12rpx;
			}
			.avatar_brother{
				width: calc(100% - 100rpx);
				margin-right: 20rpx;
				display: flex;
				flex-direction: row-reverse;
				
				.avatar_brother_box{
					max-width: 80%;
					background-color: var(--G-color);
					color:#fff;
					border-radius: 12rpx;
					line-height:60rpx;
					padding:10rpx 20rpx;
					white-space: pre-wrap;
				}
				.avatar_brother_box.avatar_brother_box_img{
					background-color: transparent;
					padding:10rpx 0;
				}
			}
		}
	}
</style>