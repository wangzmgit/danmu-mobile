import request from '@/utils/request'

//获取轮播图
export const getCarousel = () => {
    return request.get('v1/carousel');
}
