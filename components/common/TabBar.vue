<template>
	<view class="footer_m">
		<view class="footer">
			<view class="footer_li" v-for="(item,index) in data.list" :key='index' @click="tabTo(item)">
				<view :class="props.currPath==item.path ? 'on':''">
				<view class="footer_view"><view :class="item.iconfont+' footer_iconfont'"></view>
					<view class="footer_font">{{item.text}}</view>
				</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive,defineProps } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import {useRouterStore} from '@/store/router.js'
	const props = defineProps({
		currPath:String,
		default:'home'
	})
	const data = reactive({
		list:[]
	})
	onLoad(() => {
		const routerStore = useRouterStore();
		data.list = routerStore.tabBar
		//console.log(data.list)
	})
	function tabTo(item){
		if(props.currPath==item.path){
		}else{
			uni.redirectTo({
				url:'/'+item.path
			},item.needLogin)
		}
	}
</script>

<style scoped>
	.footer_m{position: fixed;height: 55px;bottom: 0;width: 100%;left: 0;background: #f9f9f9;display: flex;}
	.footer{height: 55px;width: 100%;display: flex;justify-content: space-around;align-items: center; }
	.footer_iconfont{font-size: 24px;position: relative; top: 2px;}
	.footer_li{text-align: center;}
	.footer_li .footer_font{font-size: 12px;padding: 0 20px;position: relative; top: -2px;transform: scale(0.8);}
	.footer .on { color: #677bde;}
</style>