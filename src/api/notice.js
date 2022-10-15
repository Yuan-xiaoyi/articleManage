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
  
  addNotice: (data) => {
    return instance({
      url: '/platform/pannounce/save',
      method: 'POST',
      data: data, 
    })
  },
  searchNotice: () => {
    return instance({
      url: '/platform/pannounce/list',
      method: 'POST',
    })
  }
}

export default api;