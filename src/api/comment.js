import request from '@/utils/request'

//获取评论
export const getCommentList = (vid,page,page_size) => {
  return request.get('v2/comment/get?vid='+vid+'&page='+page+'&page_size='+page_size)
}

//获取回复
export const getReplyList = (cid) => {
  return request.get('v2/comment/reply?cid='+cid)
}