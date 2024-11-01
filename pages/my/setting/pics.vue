<template>
	<view class="main">
		<view>
			<ul>
				<li>图片</li>
			</ul>
		</view>
		<view>
			<img :src="data.avatar" alt="">
		</view>
		<view>
			<view @click="chooseImg">选择</view>
		</view>
	</view>
</template>

<script setup>
	import {reactive} from 'vue'
	import { useUserStore } from '@/store/user'
	import {API_HOST} from "@/config/index.js"
	import {upload} from "@/utils/request.js"
	const userStore = useUserStore()
	const data = reactive({
				title: '图片',
				avatar:''
			})
	
	function chooseImg(){
		
		uni.chooseImage({
			count: 2,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: async (chooseImageRes) => {
				 const tempFilePaths = chooseImageRes.tempFilePaths;
				 for(let i in tempFilePaths){
					 let uploadFileRes = await upload({
					 	url:'/v1/my/pics',
					 	filePath: tempFilePaths[i],
					 })
					 console.log(uploadFileRes);
				 }
				
				// console.log(uploadFileRes);
			 
			}
		})
	}
</script>

<style>
	
</style>
