
export const SYSTEM_INFO = uni.getSystemInfoSync()

export const WsHOST = 'ws://goadmin.com';

export const HOST = 'http://192.168.0.10:8080';
//export const HOST = 'http://47.96.181.132:8081';

export const API_HOST = SYSTEM_INFO.uniPlatform === 'web' ? HOST : HOST;

export const Avatar = "/static/image/avatar.png";