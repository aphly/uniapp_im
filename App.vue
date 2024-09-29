<script>
	import { useUserStore } from '@/store/user'
	import { useRouterStore } from '@/store/router'
	export default {
		onLaunch:  function() {
			const userStore = useUserStore()
			userStore.init()
			const routerStore = useRouterStore()
			routerStore.init()
			
			const list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab']
			list.forEach(item => {
				const old_uni = uni[item]
				uni[item] = (opt={})=>{
					let hasUrl = false;
					let currUrl = opt.url.split('?')[0]
					//console.log(currUrl)
					routerStore.list.forEach(i=>{
						if(currUrl == '/'+i.path){
							hasUrl=i;
						}
					})
					//console.log(routerStore.list)
					if(hasUrl){
						if(hasUrl.needLogin && !uni.getStorageSync('userInfo')){
							 uni.navigateTo({
								url:'/pages/tabbar/login'
							})
						}else{
							old_uni(opt)
						}
					}else{
						uni.showToast({
							title:'页面不存在',
							icon:'none'
						})
					}
				}
			})
			
			// const list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab']
			// list.forEach(item => {
			// 	const old_uni = uni[item]
			// 	uni[item] = (opt={},needLogin=false)=>{
					
			// 		if(needLogin && !uni.getStorageSync('userInfo')){
			// 			uni.navigateTo({
			// 				url:'/pages/login/index'
			// 			})
			// 		}else{
			// 			old_uni(opt)
			// 		}
			// 	}
			// })
		},
		onShow:  function() {
			console.log('App Show')
			const routerStore = useRouterStore()
			/*#ifdef H5*/
			var H5CurrentUrl = window.location.href;
			let h5Page = H5CurrentUrl.split('/#/')[1]
			if(h5Page){
				routerStore.list.forEach(i=>{
					if(h5Page == i.path){
						if(i.needLogin && !uni.getStorageSync('userInfo')){
							 uni.navigateTo({
								url:'/pages/tabbar/login'
							})
						}
					}
				})
			}
			/*#endif*/
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import '@/static/css/index.css';
	@import 'https://at.alicdn.com/t/c/font_4668822_itxddzk7ovq.css';
	@import '@/static/css/c.css';
</style>
