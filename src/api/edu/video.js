import request from '@/utils/request'

export default {

  //新增章节小结
  addVideo(eduVideo) {
    return request({
      url: '/eduservice/video/addVideo',
      method: 'post',
      data: eduVideo
    })
  },
  //更具id删除章节小结
  deleteVideo(id) {
    return request({
      url: `/eduservice/video/${id}`,
      method: 'delete',
    })
  },
  //根据阿里云视频id删除视频
  deleteAliyuVideo(videoSourceId) {
    return request({
      url: `/eduvod/video/${videoSourceId}`,
      method: 'delete',
    })

  }
}
