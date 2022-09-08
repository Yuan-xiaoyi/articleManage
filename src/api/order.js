import instance from './index';
const api = {
  /**
   * 若要传参
   * GET 用 params
   * POST 用 data
   */
  
  // 订单查询（无条件）
  getOrderList2: (params) => {
    return instance({
      url: '/platform/porder/list2',
      method: 'get',
      params: params
    })
  },
  // 订单查询（有条件）
  getOrderList3: (params) => {
    return instance({
      url: '/platform/porder/list3',
      method: 'get',
      params: params
    })
  },
  
  // 新增订单
  createOrder: (data) => {
    return instance({
      url: '/platform/porder/save',
      method: 'post',
      data: data, 
    })
  },

  // 删除订单
  deleteOrder: (data) => {
    return instance({
      url: '/platform/porder/delete',
      method: 'post',
      data: data,
    })
  },

  // 写手接单
  acceptOrder(order_id){
    return instance({
      url: `/platform/porder/accept/${order_id}`,
      method: 'post',
      // data: data,
    })
  },
  

}
export default api;