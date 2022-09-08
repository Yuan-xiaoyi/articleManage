import instance from './index';
const api = {
  /**
   * 若要传参
   * GET 用 params
   * POST 用 data
   */


  // 查询订单文件信息
  searchFile: (params) => {
    return instance({
      url: `/platform/pfile/filelist/${params}`,
      method: 'get',
      // params: params,
    })
  },

  // 新增file记录
  addFileDetail: (data) => {
    return instance({
      url: '/platform/pfile/save',
      method: 'post',
      data: data,
    })
  },
  
  // 上传订单文件
  uploadOrderFile:(data) => {
    return instance({
      url: `/platform/pfile/upload/${data.id}`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data.formData, 
    })
  },

  // 下载订单文件
  downloadOrderFile:(params) => {
    return instance({
      url: `/platform/pfile/download/${params}`,
      method: 'get',
      // headers: {
      //   'responseType': 'blob'
      // },
      // data: data, 
    })
  },

}
export default api;