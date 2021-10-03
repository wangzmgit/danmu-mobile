import request from '@/utils/request'

//搜索视频
export const searchVideo = (keywords) => {
    return request.get('v1/search?keywords=' + keywords);
}