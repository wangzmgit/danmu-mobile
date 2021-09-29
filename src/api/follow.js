import request from '@/utils/request'

//获取关注数据
export const getFollowData = (uid) => {
  return request.get('v1/follow/count?uid='+uid)
}
