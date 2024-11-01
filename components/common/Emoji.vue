<template>
	<view class="emoji_list">
		<view class="emoji_li" @click.stop="selectEmoji(item)" v-for="item,index in data.emojis" :key="index">{{item}}</view>
	</view>
</template>

<script setup>
	import {reactive} from 'vue'
	const data = reactive({
		emojis:['😄','😃','😊','😉','😍','😘','😚','😜','😝','😳','😁','😔','😌','😒',
		'😞','😣','😢','😂','😭','😪','😥','😰','😓','😩','😫','😨','😱','😠',
		'😡','😤','😖','😆','😷','😵','😲','👿','😏','👲','👳','👮','👷','💂',
		'👶','👦','👧','👨','👩','👴','👵','👱','👼','👸','😺','😸','😻','😽',
		'😼','🙀','😿','😹','💀','👽','💩','🔥','✨','🌟','💢','💦','💧','💤',
		'💨','👂','👀','👃','👅','👄','👍','👎','👌','👊','✊','✌','👋','✋',
		'👐','👆','👇','👉','👈','🙌','🙏','☝','👏','💪','💃','👫','💏','💑',
		'👯','🙋','💅','🙍','🎩','👑','👒','👟','👡','👠','👢','👕','👔','👗',
		'👘','👙','💼','👜','🎀','🌂','💄','💛','💙','💜','💚','❤','💔','💗',
		'💓','💖','💞','💘','💌','💋','💍','💎']
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

<style scoped>
	.emoji_list {
		height: 508rpx;
		overflow-y: auto;
		display: flex;
		flex-wrap: wrap;
		padding:20rpx 10rpx;
		width: calc(100% - 20rpx);   
		.emoji_li{
			width: 80rpx;
			height: 80rpx;
			font-size: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>