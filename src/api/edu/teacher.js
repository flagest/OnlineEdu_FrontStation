import request from '@/utils/request'

export default {

  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
      method: `post`,
      data: teacherQuery
    })
  },
  //删除讲师
  deleteTeacher(id) {
    return request({
      url: `/eduservice/teacher/${id}`,
      method: `delete`,
    })
  },
  //新增讲师
  addTeacher(teacher) {
    return request({
      url: `/eduservice/teacher/addTeacher`,
      method: `post`,
      data: teacher
    })
  },
  //更具id去查询讲师信息
  getTeacherInfo(id) {
    return request({
      url: `/eduservice/teacher/${id}`,
      method: `get`
    })
  },
  //根据id去修改讲师信息
  updateById(teacher) {
    return request({
      url: `/eduservice/teacher/updateTeacher`,
      method: 'post',
      data: teacher,
    })
  }
}
