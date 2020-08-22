import request from '@/utils/request'

export default {
  getRegisterCount(day) {
    return request({
      url: `/edustatistics/sta/registerCount/${day}`,
      method: 'get'
    })
  },
  getShowData(searchObj) {
    return request({
      url: `/edustatistics/sta/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: "get"
    })
  }
}
