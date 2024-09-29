<template>
	<view class="main">
		<view >
			<view class="text-area">
				<text class="title">{{data.title}}</text>
			</view>
			
			<form >
				<input type="text" v-model="data.formData.id" placeholder="请输入手机号码" />
				<input type="password" v-model="data.formData.password" placeholder="请输入密码" />
			</form>
			
			<button @click="login" >登录</button>
		</view>
		
		<view >
			<view class="text-area">
				<text class="title">{{data.title}}</text>
			</view>
			<form >
				<input type="text" v-model="data.formData.id" placeholder="请输入手机号码" />
				<input type="password" v-model="data.formData.password" placeholder="请输入密码" />
			</form>
			
			<button @click="register" >注册</button>
		</view>
	</view>
</template>

<script setup>
	import { useUserStore } from '@/store/user'
	import {request} from '@/utils/request.js'
	import {reactive} from 'vue'
	
	let data = reactive({
		formData:{
			id:'',
			password:''
		},
		title: '登录',
	})
	
	const userStore = useUserStore()
	function login(){
		request({
			url: '/v1/login', 
			method:"POST",
			data:data.formData,
		}).then((res)=>{
			uni.showToast({
				title:res.msg,
				icon:'none'
			})
			if(!res.code){
				userStore.login(res.data.user)
				uni.navigateBack()
			}else{
			}
		}).catch(err=>{
			console.log(err)
		})
	};
	function register(){
		request({
			url: '/v1/register', 
			method:"POST",
			data:data.formData,
		}).then((res)=>{
			uni.showToast({
				title:res.msg,
				icon:'none'
			})
			if(!res.code){
				userStore.login(res.data.user)
				uni.navigateBack()
			}else{
			}
		}).catch(err=>{
			console.log(err)
		})
	}
	
</script>

<style>
	
</style>
