import { defineStore } from 'pinia';
import { useWsStore } from '@/store/ws.js'
import Cache from '@/utils/cache.js'
export const useUserStore = defineStore('user', {
	state: () => {
		return { 
			loginStatus:false,
			info:{} , 
			token:{},
			connector:"",
			//timestamp:0,
		};
	},
	actions: {
		init(){
			let userInfo = Cache.localData('user_info')
			if(userInfo ){
				userInfo = JSON.parse(userInfo)
				this.info = userInfo;
			}

			let userToken = Cache.localData('user_token')
			if(userToken ){
				userToken = JSON.parse(userToken)
				this.token = userToken;
				this.loginStatus = true;
			}
			
			let connector = Cache.localData('connector')
			if(connector){
				this.connector = connector;
			}
		},
		updateUserInfo(userInfo){
			this.info = userInfo;
			Cache.localData('user_info',JSON.stringify(userInfo))
		},
		updateAccessToken(access_token){
			let userToken = Cache.localData('user_token')
			if(userToken){
				userToken = JSON.parse(userToken)
				userToken['access_token'] = access_token
				this.token = userToken;
				Cache.localData('user_token',JSON.stringify(userToken))
			}
		},
		login(userInfo,token,connector) {
			this.info = userInfo;
			this.loginStatus = true;
			Cache.localData('user_info',JSON.stringify(this.info))
			this.token = token;
			Cache.localData('user_token',JSON.stringify(token))
			this.connector = connector;
			Cache.localData('connector',connector)
			const wsStore = useWsStore()
			wsStore.connect()
		},
		logout(){
			this.loginStatus=false;
			this.info={};
			this.token={};
			this.connector="";
			uni.clearStorageSync()
			const wsStore = useWsStore()
			wsStore.close()
		},
		getMobile() {
			let result = '-'
			this.info.userAuth.forEach(i=>{
				if(i.id_type=="mobile"){
					result = i.id
				}
			})
			return result
		},
	},
	
});