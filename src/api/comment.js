import request from '@/utils/request'

//获取评论
export const getCommentList = (vid,page,page_size) => {
  return request.get('v1/comment/get?vid='+vid+'&page='+page+'&page_size='+page_size)
}
