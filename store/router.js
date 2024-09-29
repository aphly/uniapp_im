import { defineStore } from 'pinia';
import { reactive } from 'vue';
import {pages,subPackages} from '@/pages.json'

export const useRouterStore = defineStore('router', {
	state: () => {
		return { 
			list:[],
			tabBar:[]
		};
	},
	actions: {
		init(){
			pages.forEach((item)=> {
				if(item.iconfont){
					this.tabBar.push({
						"path":item.path,
						"text": item.style.navigationBarTitleText,
						"iconfont":item.iconfont,
						"needLogin":item.needLogin
					})
				}
				this.list.push({
					"path":item.path,
					"text": item.style.navigationBarTitleText,
					"needLogin":item.needLogin
				})
			});
			subPackages.forEach((i)=> {
				i.pages.forEach(item => {
				    let obj = {};
				    obj.path = i.root+'/'+item.path;
				    obj.name = item.style.navigationBarTitleText;
					obj.needLogin = item.needLogin ?  item.needLogin : false;
				    this.list.push(obj)
				})
			});
		}
	},
});