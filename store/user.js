import { defineStore } from 'pinia';
import { reactive } from 'vue';
export const useUserStore = defineStore('user', {
	state: () => {
		return { 
			loginStatus:false,
			accessToken:null,
			userInfo:{} , 
		};
	},
	actions: {
		init(){
			let userInfo = uni.getStorageSync('userInfo')
			if(userInfo){
				userInfo = JSON.parse(userInfo)
				this.userInfo = userInfo;
				this.loginStatus = true;
				this.accessToken = userInfo.access_token;
			}
		},
		changeAccessToken(access_token){
			let userInfo = uni.getStorageSync('userInfo')
			if(userInfo){
				userInfo = JSON.parse(userInfo)
				userInfo['access_token'] = access_token
				this.accessToken = access_token
				uni.setStorageSync('userInfo',JSON.stringify(userInfo))
			}
		},
		login(userInfo) {
			this.userInfo = userInfo;
			this.loginStatus = true;
			this.accessToken = userInfo.access_token;
			uni.setStorageSync('userInfo',JSON.stringify(this.userInfo))
		},
		logout(){
			this.loginStatus=false;
			this.accessToken=null;
			this.userInfo={};
			uni.removeStorageSync('userInfo')
		}
	},
	
});