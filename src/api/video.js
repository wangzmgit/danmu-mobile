import request from '@/utils/request'

//获取我的视频
export const getMyVideo = (page, page_size) => {
  return request.get('v1/video/upload/get?page=' + page + '&page_size=' + page_size);
}

//获取视频信息
export const getVideoInfo = (vid) => {
  return request.get('v1/video/get?vid=' + vid);
}

//获取我的收藏
export const getMyCollect = (page, page_size) => {
  return request.get('v1/video/collect/get?page=' + page + '&page_size=' + page_size);
}

//通过用户ID获取视频
export const getVideoListByUid = (uid, page, page_size) => {
  return request.get('v1/video/user/get?uid=' + uid + '&page=' + page + '&page_size=' + page_size);
}

//获取视频列表
export const getVideoList = (page,page_size) => {
  return request.get('v1/video/list/get?page=' + page + '&page_size=' + page_size);
}