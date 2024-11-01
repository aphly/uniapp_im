
export const SYSTEM_INFO = uni.getSystemInfoSync()

export const WsHOST = 'ws://192.168.37.55:8080';

export const HOST = 'http://192.168.37.55:8080';

export const API_HOST = SYSTEM_INFO.uniPlatform === 'web' ? HOST : HOST;
