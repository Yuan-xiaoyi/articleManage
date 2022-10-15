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
      data: data, 
    })
  },
  
  verifyPassword: (data) => {
    return instance({
      url: '/sys/user/verifypassword', 
      method: 'post',
      data: data, 
    })
  },
  changeStatus: (data) => {
    return instance({
      url: '/sys/user/status', 
      method: 'post',
      data: data, 
    })
  },
  update: (data) => {
    return instance({
      url: '/sys/user/update', 
      method: 'post',
      data: data, 
    })
  },

  delUser: (data) => {
    return instance({
      url: '/sys/user/delete',
      method: 'post',
      data: data, 
    })
  },
}
export default api;