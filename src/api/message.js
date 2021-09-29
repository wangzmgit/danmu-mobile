import request from '@/utils/request'

//获取公告
export const getAnnounce = () => {
    return request.get('v1/message/announce');
}

//获取私信列表
export const getMsgList = () =>{
    return request.get('v1/message/list')
}

//获取私信列表
export const getMsgDetails = (fid) =>{
    return request.get('v1/message/details?fid='+fid)
}

//发送私信
export const sendMsg = ({fid,content}) =>{
    return request.post('v1/message/send',{fid,content})
}