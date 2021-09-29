import request from '@/utils/request'

//发送弹幕
export const SendDanmakuAPI = (vid,time,color,type,text) => {
    return request.post('v1/danmaku/send', { vid,time,color,type,text });
}

//获取弹幕
export const GetDanmakuAPI = (vid) => {
    return request.get('v1/danmaku/get?vid='+vid);
}
