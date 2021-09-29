import request from '@/utils/request';

//注册register
export const register = ({ name, email, password, code }) => {
    return request.post('v1/user/register', { name, email, password, code });
}

//登录
export const login = ({ email, password }) => {
    return request.post('v1/user/login', { email, password });
}

//获取用户信息
export const getUserInfo = () => {
    return request.get('v1/user/info/get');
}
