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
		header['X-Token'] = `${user.token.access_token}`;
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
							uni.reLaunch({
								url: "/pages/tabbar/login"
							})
							//reject(err)
						});
					}else if(res.data.code==401){
						user.logout()
						uni.reLaunch({
							url: "/pages/tabbar/login"
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
		header['X-Token'] = `${user.token.access_token}`;
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
							uni.reLaunch({
								url: "/pages/tabbar/login"
							})
						});
					}else if(myRes.code==401){
						user.logout()
						uni.reLaunch({
							url: "/pages/tabbar/login"
						})
					}else{
						resolve(myRes)
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

export function refreshToken() {
    return new Promise((resolve, reject) => {
		const user = useUserStore()
		if(user.loginStatus){
			let header = {}
			header['X-Token'] = user.token.refresh_token
			let url = urlAddHost('/account/refresh_token');	
			uni.request({
			    url,
				header,
			    success: (res) => {
			        if (res.statusCode === 200) {
						if(res.data.code === 0){
							user.updateAccessToken(res.data.data)
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

 export async function appUploadOss(dir,filePath){
		const signRes = await request({
			url:'/oss/sign',
			method:"POST",
			data:{"dir":dir},
		})
		if(signRes.code){
			uni.showToast({
				title: signRes.msg,
				icon:'error'
			})
			return false
		}
		
		let fileExtension = filePath.split('.').pop();
		let data = signRes.data.sign
		
		let response = await uni.uploadFile({
			url: data.host, 
			filePath,
			name: 'file',
			formData: {
				'success_action_status': '200',
				'policy': data.policy,
				'x-oss-signature': data.signature,
				'x-oss-signature-version': "OSS4-HMAC-SHA256",
				'x-oss-credential':  data.x_oss_credential,
				'x-oss-date': data.x_oss_date,
				'key': data.dir + signRes.data.filename+'.'+fileExtension,
				'x-oss-security-token':data.security_token,
				'callback': data.callback,
			}
		});
		
		if (response.statusCode!=200) {
			uni.showToast({
				title: 'Network response was not ok',
				icon:'error'
			})
			return false
		}
		
		let ossRes = response.data
		ossRes = JSON.parse(ossRes)
		if(ossRes.code){
			uni.showToast({
				title: ossRes.msg,
				icon:'error'
			})
		}
		return ossRes
	}