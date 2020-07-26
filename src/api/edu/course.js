import request from '@/utils/request'

export default {

  //添加课程信息
  addCourseInfo(courseInfoVO) {
    return request({
      url: '/eduservice/course/addCourseInfo',
      method: 'post',
      data: courseInfoVO
    })
  },
  //查询所有讲师
  getAllTeacher() {
    return request({
      url: '/eduservice/teacher/findAll',
      method: 'get',
    })
  },
  //根据课程id去查询
  getCourseInfo(courseId) {
    return request({
      url: `/eduservice/course/getCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  //修改课程信息
  updateCourseInfo(courseInfoVo) {
    return request({
      url: '/eduservice/course/updateCourseInfo',
      method: 'post',
      data: courseInfoVo
    })
  },
  //确认课程信息
  getPublishCourseInfo(courseId) {
    return request({
      url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  //用于课程的发布
  publishCourse(id) {
    return request({
      url: '/eduservice/course/publishCourse/' + id,
      method: 'post'
    })
  },
  //查询所有接口
  getCourseConditionList(current, limit, courseSerachVO) {
    return request({
      url: `/eduservice/course/pageCourseCondition/${current}/${limit}`,
      method: 'post',
      data: courseSerachVO

    })
  },
  //逻辑上删除课程id
  deleteCourse(id) {
    return request({
      url: `/eduservice/course/${id}`,
      method: 'delete'
    })
  }

}
