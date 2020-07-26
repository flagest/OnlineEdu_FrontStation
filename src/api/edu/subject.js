import request from '@/utils/request'

export default {

  //获取菜单列表
  getSubjectList() {
    return request({
      url: '/eduservice/subject/getAllOneTwoSubject',
      method: 'get'
    })
  }
}
