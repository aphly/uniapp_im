
export const SYSTEM_INFO = uni.getSystemInfoSync()

export const HOST = 'http://localhost:8080';

export const API_HOST = SYSTEM_INFO.uniPlatform === 'web' ? HOST : HOST;
