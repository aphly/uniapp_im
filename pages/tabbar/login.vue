<template>
	<view class="layout">
	<view class="main fill">
		<view class=" form_request">
			<view class="accountContent" v-if="data.mod=='sms'">
				<view class="text-center" style="margin-bottom: 20px;">
					<view class="title">短信登录</view>
					<view class="descrip">使用短信登录</view>
				</view>
				<view class="smsCode">
					<input type="text" name="id"  v-model="data.formData.id" autocomplete="off" required="" placeholder="请输入手机号码">
				</view>
				<button @click="next"  class="btn loginBtn text-brand">获取验证码</button>
			</view>
			<view v-else-if="data.mod=='password'"  class="accountContent">
				<view class="text-center" style="margin-bottom: 20px;">
					<view class="title">密码登录</view>
					<view class="descrip">使用密码登录</view>
				</view>
				<view class="accountContentNew">
					<view class="form-group ">
						<view class="form-group1 ">
							<view class="uniapp icon-shouji"></view>
						</view>
						<view class="form-group2 ">
							<input type="text" name="id" class="form-control" v-model="data.formData.id" autocomplete="off" required="" placeholder="请输入手机号码">
							<view class="invalid-feedback"></view>
						</view>
						
					</view>
					<view class="form-group ">
						<view class="form-group1 ">
							<view class="uniapp icon-mima"></view>
						</view>
						<view class="form-group2 ">
							<input type="password" name="password" class="form-control" v-model="data.formData.password" required="" autocomplete="off" placeholder="请输入6位以上">
							<view class="invalid-feedback"></view>
						</view>
						
					</view>
				</view>
				<button @click="login" class="btn loginBtn text-brand">立刻登录</button>
			</view>
			
			<view class="">
				<view class="split-line ">
					<view class="agree" >
						<label class="">
							<radio value="1" :checked="true" />
						</label>
						<view>
							我已阅读并同意 协议。
						</view>
					</view>
				</view>
				<view class="line-between">
					<view>Or</view>
				</view>
				<view class="ext_login">
					<view class="uniapp_box password " v-if="data.mod=='sms'" @click="data.mod='password'">
						<view class="uniapp icon-ai-password"></view>
					</view>
					<view class="uniapp_box sms" v-else-if="data.mod=='password'" @click="data.mod='sms'">
						<view class="uniapp icon-duanxinshezhi"></view>
					</view>
					<view class="uniapp_box weixin">
						<view class="uniapp icon-weixin1"></view>
					</view>
					<view class="uniapp_box qq">
						<view class="uniapp icon-qq1"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script setup>
	import { useUserStore } from '@/store/user'
	import {request} from '@/utils/request.js'
	import {reactive} from 'vue'
	
	let data = reactive({
		formData:{
			id_type:'mobile',
			id:'',
			password:''
		},
		mod: 'sms',
	})
	
	const userStore = useUserStore()
	
	async function login(){
		let res  = await request({
			url: '/account/login', 
			method:"POST",
			data:data.formData,
		})
		if(res.code){
			uni.showToast({
				title:res.msg,
				icon:'none'
			})
			return
		}
		res.data = JSON.parse(res.data)
		userStore.login(res.data.user,res.data.token,res.data.connector)
		uni.switchTab({
			url: "/pages/tabbar/chatList"
		})
	}
	
	async function next(){
		if(isValidChineseMobile(data.formData.id)){
			uni.navigateTo({
				url: "/pages/tabbar/sms?mobile="+data.formData.id
			})
		}else{
			
		}
	}
	
	function isValidChineseMobile(phone) {
	    const regex = /^1\d{10}$/;
	    return regex.test(phone);
	}
	
</script>

<style lang="scss" scoped>
	.fill{
		background-color: #fff;
	}
	.account_form {background: #fff;height: 100%;}
	
	.account_form .label{font-weight: 600;}
	.account_form input{height: 80rpx;border: 2rpx solid #ced4da;border-radius: 10rpx;}
	.account_form button{width: 100%;height: 80rpx;font-size: 32rpx;}
	.account_form .alert-warning{color:#dd3545;}
	.form-group{
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		input{padding: 0 20rpx;}
		.form-group1{
			width: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.uniapp{
				font-size: 40rpx;
			}
		}
		.form-group2{
			flex-grow: 1;
		}
	}
	.form-group .label{margin-bottom: 10rpx;}
	.descrip{margin-top: 10rpx;color:#999;font-size: 24rpx;}
	.accountContent{max-width: 100%;margin: 180rpx auto 20rpx;}
	.accountContent .forget{color:#777;}
	.split-line{margin-top: 30rpx;}
	.split-line .split-line1{color:#777;}
	.split-line .split-line2{font-weight: 600;margin-left: 10rpx;}
	.line-between{display:flex;flex-direction:row;padding:30rpx 0;width: 80%;margin: 80rpx 10% 40rpx;}
	.line-between:after,.line-between:before{border-bottom:2rpx solid #e6e6e6;content:"";flex:1;margin:auto}
	.line-between:before{margin-right:20rpx}
	.line-between:after{margin-left:20rpx}
	.text-brand{--tw-gradient-from:#677bde;--tw-gradient-to:#4c5eb2;
	--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to,rgba(28,157,254,0));
	background-image:linear-gradient(to right,var(--tw-gradient-stops));border:none;color:#fff;margin-top: 15px;}

	.title{font-size: 48rpx;font-weight: 600}
	.loginBtn{color:#fff;
		margin: 80rpx 5% 40rpx;
		width: 90%;
		border-radius: 50rpx;
	}
	.accountContentNew{
		width: 90%;
		margin: 20rpx 5%;
		.label{
			color: #999;
			font-size: 28rpx;
		}
		input{
			border-bottom: 1px solid #f1f1f1;
			height: 80rpx;
			line-height: 80rpx;
		}
	}
	
	.confirmation{margin-top: 40rpx;}
	.btn.text-brand:hover {color: #fff;}
	.text-center {text-align: center;}
	
	.agree{
		color:#999;font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		radio {
			transform:scale(0.6)
		}
	}
	.ext_login{
		padding: 30rpx 0;
		display: flex;
		justify-content: center;
		.uniapp_box{
			border-radius: 50%;
			padding: 20rpx;
			margin: 20rpx;
			.uniapp{
				color:#fff;
			}
		}
		.sms{
			background-color: #4c5eb2;
		}
		.password{
			background-color: #4c5eb2;
		}
		.qq{
			background-color: #4c5eb2;
		}
		.weixin{
			background-color: #4c5eb2;
		}
	}
	.smsCode{
		width: 90%;
		margin: 80rpx 5%;
		border-bottom: 1px solid #f1f1f1;
		
		input{
			line-height: 80rpx;
			height: 80rpx;
			text-align: center;
			font-size: 36rpx;
		}
	}
	
</style>
