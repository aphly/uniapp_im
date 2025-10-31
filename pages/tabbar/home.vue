<template>
	<view class="layout">
		
		<view class="main ">
			<button @click="tiaoz">跳转</button>
		</view>
	</view>
</template>

<script setup>
	import {reactive,ref} from 'vue'

	import TabBar from '@/components/common/TabBar.vue'
	import { onShow,onReady } from '@dcloudio/uni-app'
	
	const data = reactive({
				title: 'Home',
				list:["a","b",'c'],
				count:0,
				unilist:[]
	})
	
	const list = ref([
		{
		    "id": "231",
		    "chat_id": "4",
		    "uuid": "93273802959491072",
		    "msg_type": 1,
		    "to_id": "94363586037551104",
		    "message": "去",
		    "js_id": "evLdrSrdHmGa34xjZJNtA6bK3dAmCG3e",
		    "created_at": 1730375223,
		    "ChatMessageUser": {
		        "uuid": "94363586037551104",
		        "nickname": "乙"
		    }
		},
		{
		    "id": "232",
		    "chat_id": "4",
		    "uuid": "93273802959491072",
		    "msg_type": 1,
		    "to_id": "94363586037551104",
		    "message": "啊",
		    "js_id": "nZHlFZFrx8Dk5kWxpCefbQ8b0NZ1MNRB",
		    "created_at": 1730375267,
		    "ChatMessageUser": {
		        "uuid": "94363586037551104",
		        "nickname": "乙"
		    }
		}
	]);
	
	function tiaoz(){
		uni.navigateTo({
			url:"/pages/chat/test"
		})
	}
	onShow(() => {
		// list.value = list.value.map((item)=>{
		// 	console.log(item)
		// 	item['desc'] = "ok"
		// 	return item
		// })
		// console.log('onShow')
		// console.log(list.value)
	})
	
</script>

<style>
</style>
