import request from '@/utils/request'

export default {
  getRegisterCount(day) {
    return request({
      url: `/edustatistics/sta/registerCount/${day}`,
      method: 'get'
    })
  }
}
