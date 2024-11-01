import { useUserStore } from '@/store/user'
import {API_HOST} from "@/config/index.js"

export const urlAddHost = (url = '') => {
  if (url.slice(0, 4) === 'http'){
	  return url
  } else{
	  return `${API_HOST}${url}`
  }
}

export function request(config={}){	
	let {
		url,
		data={},
		method="GET",
		header={}
	} = config
	
	url = urlAddHost(url);	
	const user = useUserStore()
	if(user.loginStatus){
		header['Authorization'] = `Bearer ${user.accessToken}`;
	}
	return new Promise((resolve,reject)=>{	
		uni.request({
			url,
			data,
			method,
			header,
			success:res=>{	
				if(res.statusCode === 200){
					if(res.data.code==402){
						refreshToken().then(() => {
							request(config).then(res1=>{
								resolve(res1)
							}).catch(err=>{
								reject(err)
							});
						}).catch(err=>{
							user.logout()
							uni.navigateTo({
								url: "/pages/login/index"
							})
							//reject(err)
						});
					}else if(res.data.code==401){
						user.logout()
						uni.navigateTo({
							url: "/pages/login/index"
						})
					}else{
						resolve(res.data)
					}
				}else{
					uni.showToast({
						title:'网络错误状态:'+res.statusCode,
						icon:"none"
					})
					reject(res)
				}
			},
			fail:err=>{
				console.log(err)
				uni.showToast({
					title:'网络错误',
					icon:"none"
				})
				reject(err)
			}
		})
	})
}

export function upload(config={}){
	let {
		url,
		data={},
		method="POST",
		filePath,
		formData,
		name="file",
		header={}
	} = config
	url = urlAddHost(url);
	const user = useUserStore()
	if(user.loginStatus){
		header['Authorization'] = `Bearer ${user.accessToken}`;
	}
	return new Promise((resolve,reject)=>{	
		uni.uploadFile({
			url, 
			filePath,
			name,
			formData,
			header,
			success: (res) => {
				if(res.statusCode === 200){
					let myRes = JSON.parse(res.data)
					if(myRes.code==402){
						refreshToken().then(() => {
							upload(config).then(res1=>{
								resolve(res1)
							}).catch(err=>{
								reject(err)
							});
						}).catch(err=>{
							user.logout()
							uni.navigateTo({
								url: "/pages/login/index"
							})
						});
					}else if(myRes.code==401){
						user.logout()
						uni.navigateTo({
							url: "/pages/login/index"
						})
					}else{
						resolve(res.data)
					}
				}else{
					uni.showToast({
						title:'网络错误状态:'+res.statusCode,
						icon:"none"
					})
					reject(res)
				}
			},
		})
	});
}

function refreshToken() {
    return new Promise((resolve, reject) => {
		const user = useUserStore()
		if(user.loginStatus){
			let header = {}
			header['Authorization'] = 'Bearer '+ user.userInfo.refresh_token
			let url = urlAddHost('/v1/refresh_token');	
			uni.request({
			    url,
				header,
			    success: (res) => {
			        if (res.statusCode === 200) {
						if(res.data.code === 0){
							user.changeAccessToken(res.data.data.user.access_token)
							resolve(res.data);
						}else{
							user.logout()
							reject(res.data);
						}
			        } else {
			            reject(res);
			        }
			    },
			    fail: (err) => {
			        reject(err);
			    }
			});
		}else{
			reject('请登录');
		}
    });
}