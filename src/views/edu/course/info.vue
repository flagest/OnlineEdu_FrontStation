<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" style="width: 30%" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <!--  一级分类-->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类" @change="subjectLevelOneChanged" style="width: 15%">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>

        <!--     二级分类-->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="二级分类" style="width: 15%;">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>


      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <!--  <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/eduoss/fileoss/upload'"
            class="avatar-uploader">
            <img :src="courseInfo.cover">
          </el-upload>-->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss/upload'">
          <img v-if="courseInfo.cover" :src="courseInfo.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

      </el-form-item>


      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>
      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
        <!--<el-input type="textarea" style="width: 30%" v-model="courseInfo.description" placeholder=""/>-->
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import course from '@/api/edu/course'
  import subject from '@/api/edu/subject'
  import Tinymce from '@/components/Tinymce'

  export default {
    //第三方组件要声明
    components: {course, subject, Tinymce},
    data() {
      return {
        saveBtnDisabled: false,//保存按钮是否禁用
        courseInfo: {
          title: '',
          lessonNum: '',
          price: '',
          description: '',
          teacherId: '',
          subjectId: '',//二级分类
          subjectParentId: '',//一级分类
          // cover: '/static/timg.jpg',
          cover: '',
        },
        teacherList: [],//封装所有讲师
        subjectOneList: [],//课程一级分类
        subjectTwoList: [],//课程二级分类
        BASE_API: process.env.BASE_API,//接口地址
        courseId: '',//课程id
      }
    },
    created() {
      //获取页面路由
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id;
        this.getInfo()
      } else {

        //初始化课程分类
        this.getOneSubject()
        //初始化页面调用
        this.getAllTeacher()
      }
      this.courseInfo = {}
    },
    methods: {
      //根据课程id去查询
      getInfo() {
        course.getCourseInfo(this.courseId).then(response => {
          this.courseInfo = response.data.courseInfoVo;
          subject.getSubjectList().then(response => {
            this.subjectOneList = response.data.data;
            for (let i = 0; i < this.subjectOneList.length; i++) {
              let oneSubject = this.subjectOneList[i];
              //这一步主要是确定传入value是哪一个一份分类
              if (this.courseInfo.subjectParentId === oneSubject.id) {
                this.subjectTwoList = oneSubject.children;
              }
            }
          })
          //获取所有讲师信息
          this.getAllTeacher()
        })
      },

      handleAvatarSuccess(res, file) {
        this.courseInfo.cover = res.data.url
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //根据一级分类查询二级分类
      subjectLevelOneChanged(value) {
        this.courseInfo.subjectId = ''
        for (var i = 0; i < this.subjectOneList.length; i++) {
          var onesubject = this.subjectOneList[i]
          //这一步主要是确定传入value是哪一个一份分类
          if (value === onesubject.id) {
            this.subjectTwoList = onesubject.children
          }
        }
      },
      //获取课程一级分类
      getOneSubject() {
        subject.getSubjectList().then(response => {
          this.subjectOneList = response.data.data;
        })
      },
      saveOrUpdate() {
        if (!this.courseInfo.id)
          this.addCourse();
        this.update();

      },
      update() {
        course.updateCourseInfo(this.courseInfo).then(response => {
          if (response.success == true) {
            this.$message({
              type: 'success',
              message: '修改课程信息成功:)'
            })
            this.$router.push({path: '/course/chapter/' + this.courseId})
          }
        })
      },
      addCourse() {
        course.addCourseInfo(this.courseInfo).then(response => {
          if (response.success === true) {
            this.$message({
              type: 'success',
              message: '添加课程成功:)'
            })
            //跳转到第二步骤
            this.$router.push({path: '/course/chapter/' + response.data.courseId})
          } else {
            this.$message({
              type: 'error',
              message: '添加课程失败:('
            })
          }
        })
      },
      getAllTeacher() {
        course.getAllTeacher().then(response => {
          this.teacherList = response.data.items;
        })
      }
    }
  }

</script>
<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .tinymce-container {
    line-height: 29px;
  }
</style>

