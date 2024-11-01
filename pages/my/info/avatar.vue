<template>
	<view class="main">
		<view>
			<ul>
				<li>头像</li>
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
	import {upload,request} from "@/utils/request.js"
	const userStore = useUserStore()
	const data = reactive({
				title: '头像',
				avatar:''
			})
	
	function chooseImg(){
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: async (chooseImageRes) => {
				const tempFilePaths = chooseImageRes.tempFilePaths;
				
				let res = await request({
					url:'/v1/my/upload_policy_token',
				})
				console.log(res)
				if(!res.code){
					const uploadFileRes = await upload({
						url:'/v1/my/avatar',
						filePath: tempFilePaths[0],
						formData:{
							'policy': res.data.policy, // 返回签名参数中的policy
							'OSSAccessKeyId': res.data.accessId, // 返回参数中的的accesskey
							'success_action_status': '200', //如果不设置success_action_status为200，文件上传成功后则返回204状态码。
							'signature': res.data.signature, // 返回参数中的上传签名
							"callback": res.data.callback
						}
					})
					console.log(uploadFileRes);
				}
				
			 
			}
		})
	}
	
	function chooseImg1(){
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: async (chooseImageRes) => {
				const tempFilePaths = chooseImageRes.tempFilePaths;
				
				await request({
					url:'/v1/my/upload_policy_token',
				})
				
				const uploadFileRes = await upload({
					url:'/v1/my/avatar',
					filePath: tempFilePaths[0],
				})
				console.log(uploadFileRes);
			 
			}
		})
	}
</script>

<style>
	
</style>
