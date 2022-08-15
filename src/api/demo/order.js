import instance from '../index';
const api = {
  /**
   * 若要传参
   * GET 用 params
   * POST 用 data
   */
  
  getOrderList: () => {
    return instance({
      url: '/getUsers',
      method: 'get',
    })
  },

}
export default api;