<script>
	import { useUserStore } from '@/store/user'
	import { useRouterStore } from '@/store/router'
	import { useWsStore } from '@/store/ws.js'
	import { refreshToken } from '@/utils/request.js';
	import Cache from '@/utils/cache.js';
	export default {
		onLaunch:  function() {
			
			console.log(uni.getSystemInfoSync())
			const userStore = useUserStore()
			userStore.init()
			const routerStore = useRouterStore()
			routerStore.init()
			
			const wsStore = useWsStore()
			wsStore.connect()
			
			const list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab', 'preloadPage']
			list.forEach(item => {
				const old_uni = uni[item]
				uni[item] = (opt={})=>{
					let hasUrl = false;
					let currUrl = opt.url.split('?')[0]
					routerStore.list.forEach(i=>{
						if(currUrl == '/'+i.path){
							hasUrl=i;
						}
					})
					//console.log(routerStore.list)
					if(hasUrl){
						if(hasUrl.needLogin && !userStore.loginStatus){
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
			
		},
		onShow:  function() {
			console.log('App Show')
			const routerStore = useRouterStore()
			const userStore = useUserStore()
			/*#ifdef H5*/
			var H5CurrentUrl = window.location.href;
			let h5Page = H5CurrentUrl.split('/#/')[1]
			if(h5Page){
				routerStore.list.forEach(i=>{
					if(h5Page == i.path){
						if(i.needLogin && !userStore.loginStatus){
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

<style lang="scss">
	/*每个页面公共css */
	@import '@/static/css/index.css';
	@import '@/static/iconfont/iconfont.css';
	@import '@/static/css/c.css';
	@import '@/static/css/my.css';
	:root {
	  --G-color: #32b32a;
	  --G-color-d: #43ec37;
	}
	
	/* 通用解决方案（全平台） */
	.uni-tabbar-border {
	    background-color: transparent !important;
	    height: 0 !important;
	    border: none !important;
	}
	 
	/* 小程序平台强化处理 */
	/* #ifdef MP-WEIXIN */
	uni-tabbar .uni-tabbar__border {
	    display: none !important;
	}
	/* #endif */
	 
	/* 专门处理 APP 平台 */
	/* #ifdef APP-PLUS */
	/* 移除 iOS 阴影线 */
	.uni-tabbar.uni-tabbar--topselected {
	    border-top: none !important;
	}
	 
	/* 移除 Android 边框线 */
	.uni-tabbar {
	    border-top-color: transparent !important;
	    border-top-width: 0px !important;
	    box-shadow: none !important;
	}
	 
	/* 处理 iOS 15+ 新样式 */
	.uni-tabbar__content {
	    background-image: none !important;
	}
	/* #endif */
	
	
</style>
