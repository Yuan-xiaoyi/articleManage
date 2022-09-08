//引入request文件
import instance from './index';
 
//导出封装ok的请求
 
//查询需求申请列表,getURLList为请求名
const api = {
  /**
   * 若要传参
   * GET 用 params
   * POST 用 data
   */

  
  getURLList: () => {
    return instance({
      url: '/getUsers',
      method: 'get',
    })
  },

  // 图片验证码
  adornUrl:(data) => {
    return instance({
      url: '/captcha.jpg',
      method: 'get',
      params: data, 
    })
  },

  login: (data) => {
    return instance({
      url: '/sys/login',
      method: 'post',
      //请求传递的参数
      data: data, 
    })
  },

  // 获取当前用户信息
  getUserInfo(data){
    return instance({
      url: data ? `/sys/user/info/${data}` : '/sys/user/info',
      method: 'get'
    })
  },
  // 获取所有用户
  getUserList(){ //data
    return instance({
      url: '/sys/user/list',
      method: 'get',
      // params: data,
    })
  },
  
  register: (data) => {
    return instance({
      url: '/sys/user/save', 
      method: 'post',
      //请求传递的参数
      data: data, 
    })
  },
  
  verifyPassword: (data) => {
    return instance({
      url: '/sys/user/verifypassword', 
      method: 'post',
      //请求传递的参数
      data: data, 
    })
  },

  update: (data) => {
    return instance({
      url: '/sys/user/update', 
      method: 'post',
      //请求传递的参数
      data: data, 
    })
  },

  del: (data) => {
    return instance({
      url: '/delUser',
      method: 'POST',
      //请求传递的参数
      data: data, 
    })
  },
}
export default api;