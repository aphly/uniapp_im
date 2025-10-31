import {refreshToken} from '@/utils/request.js'
export default class websocket {
	constructor(userStore) {
		this.ws=null
		this.url="" 
		this.reconnectInterval =null
		this.reconnectIntervalTime= 5000
		this.userStore =userStore
	}

	connect() {
		if(!this.userStore.token.access_token || !this.userStore.connector || this.ws){
			console.log("return")
			return
		}
		this.url = "ws://"+this.userStore.connector+'?token='+this.userStore.token.access_token
		this.ws = uni.connectSocket({
			url:this.url,
			complete: ()=> {}
		});
		
		this.ws.onOpen((res) => {
			console.log("WebSocket连接正常！");
			clearInterval(this.reconnectInterval)
			switch(this.ws.readyState) {
			    case 0:
			      console.log('WebSocket状态：连接中...');
			      break;
			    case 1:
			      console.log('WebSocket状态：已连接');
			      break;
			    case 2:
			      console.log('WebSocket状态：关闭中...');
			      break;
			    case 3:
			      console.log('WebSocket状态：已关闭');
			      break;
			}
		})
		
		this.ws.onClose((e) => {
			console.log(e)
			this.ws=null
			if(e.code==402){
				refreshToken().then((resT) => {
					//console.log(resT)
					this.reconnect()
				}).catch(err=>{
					this.userStore.logout()
					console.log("已经被关闭了")
				});
			}else if(e.code==401){
				this.userStore.logout()
				console.log("已经被关闭了:"+e.code)
			}else{
				console.log("已经被关闭了:"+e.code)
				this.autoReconnect()
			}
		})
		this.ws.onError((res)=>{
			console.log("onError",res)
		})
		this.ws.onMessage((res) => {
			return callback(res)
		})
	}
	reconnect(){
		if(this.ws!==null){
			this.ws.close();
			this.ws = null;
		}
		console.log("重新连接")
		this.connect();
	}
	close(){
		if(this.ws!==null){
			this.ws.close();
		}
	}
	autoReconnect(){
		if(this.ws===null){
			this.reconnectInterval = setTimeout(()=>{
				console.log("自动重新连接")
				this.reconnect();
			},this.reconnectIntervalTime)
		}
	}
	getMessage(callback) {
		if(!this.ws){
			console.log("ws close")
			return
		}
		this.ws.onMessage((res) => {
			return callback(res)
		})
	}
	
	send(route,body={}){
		if(!this.ws){
			console.log("ws close")
			return
		}
		let data ={
			route:route,
			body:JSON.stringify(body)
		}
		if(this.ws.readyState===0){
			setTimeout(this.ws.send({
				data:JSON.stringify(data),
				async success() {
					console.log("消息发送成功");
				},
			}),1000)
		}else{
			this.ws.send({
				data:JSON.stringify(data),
				async success() {
					console.log("消息发送成功");
				},
			});
		}
	}
}

