<template>
	<view class="emoji">
		<view class="all_emoji">
			所有表情
		</view>
		<view class="emoji_list">
			<view class="emoji_li" @touchend.prevent="selectEmoji(item)" v-for="item,index in data.emojis" :key="index">{{item}}</view>
		</view>
	</view>
</template>

<script setup>
	import {reactive} from 'vue'
	const data = reactive({
		emojis:['😀','😁','😂','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😗',
			'😙','😚','😇','😐','😑','😶','😏','😣','😥','😮','😯','😪','😫','😴','😌','😛','😜','😝',
			'😒','😓','😔','😕','😲','😷','😖','😞','😟','😤','😢','😭','😦','😧','😨','😬','😰','😱',
			'😳','😵','😡','😠','😈','👿','👹','👺','💀','👻','👽','👦','👧','👨',
			'👩','👴','👵','👶','👱','👮','👲','👳','👷','👸','💂','🎅','👰','👼','💆',
			'💇','🙍','🙎','🙅','🙆','💁','🙋','🙇','🙌','🙏','👤','👥','🚶','🏃','👯','💃','👫',
			'💑','👪','💪','👈','👉','☝','👆','👇','✌','✋','👌','👍','👎','✊','👊','👋','👏',
			'👐','✍','👣','👀','👂','👃','👅','👄','💋','👓','👔','👕','👖','👗','👘','👙','👚',
			'👛','👜','👝','🎒','💼','👞','👟','👠','👡','👢','👑','👒','🎩','🎓','💄','💅','💍','🌂'
		]
	})
	
	const emit = defineEmits(['FromChild']);
	
	function selectEmoji(str){
		emit('FromChild', str);
	}
	
	function unicodeString(str){
		return str.replace(/\\u([\dA-Fa-f]{4}|[\dA-Fa-f]{2})/g, function(match, p1) {
		  let code = parseInt(p1, 16);
		  return String.fromCharCode(code);
		});
	}
</script>

<style scoped lang="scss">
	.emoji{
		margin:40rpx 10rpx;
		overflow-y: auto;
		height: 500rpx;
		.all_emoji{color:#999;font-size: 20rpx;padding:10rpx 20rpx;}
		.emoji_list {
			display: flex;
			flex-wrap: wrap;
			.emoji_li{
				width: 80rpx;
				height: 80rpx;
				padding:10rpx 12rpx;
				font-size: 50rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
	
</style>