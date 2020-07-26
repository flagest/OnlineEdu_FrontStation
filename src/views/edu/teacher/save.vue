<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>
        <!--
          v-show:是否显示长传按钮
          ：key:类似与id，如果一个页面上可以做多个上传控件，可以作区分
          ：url后台上传图片地址
          @close:关闭上传组件
          @crop-upload-success：上传成功后的回调
        -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>


      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import teacher from '@/api/edu/teacher'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    name: "save",
    components: {teacher, ImageCropper, PanThumb},
    data() {
      return {
        teacher: {
          name: '',
          // sort: 0,
          level: 1,
          career: '',
          intro: '',
          avatar: '',
        },
        BASE_API: process.env.BASE_API, // 接口API地址
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0, // 上传组件id
        BASE_API: process.env.BASE_API,//接口API


      }
    },
    created() {
      this.init()
    },
    //这是vue中的页面监听
    watch: {
      $route(to, form) {
        this.init()
      }
    },
    methods: {
      close() {//关闭弹窗方法
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1;
      },
      cropSuccess(data) {//上传成功方法
        this.imagecropperShow = false //关闭弹窗
        this.teacher.avatar = data.url //将URL赋值给teacher.avatar
        this.imagecropperKey = this.imagecropperKey + 1;
      },
      init() {
        //判断路由中是否带有id值
        if (this.$route.params && this.$route.params.id) {
          const id = this.$route.params.id;
          this.getTeacherByid(id)
        } else {
          this.teacher = {}
        }
      },
      //根据id去查询
      getTeacherByid(id) {
        teacher.getTeacherInfo(id).then(response => {
          this.teacher = response.data.item;
        })
      },
      //这个方式时用来判断添加还是修改
      saveOrUpdate() {
        if (!this.teacher.id) {
          //添加
          this.saveTeacher()
        } else {
          //修改
          this.updateTeacher()
        }

      },
      saveTeacher() {
        teacher.addTeacher(this.teacher).then(response => {
          this.$message({
            type: 'success',
            message: '添加成功！'
          });
          //添加成功后要跳转到讲师列表页面
          this.$router.push({path: '/teacher/table'})
        })
      },
      updateTeacher() {
        teacher.updateById(this.teacher).then(response => {
          this.$message({
            type: 'success',
            message: '修改讲师信息成功！'
          })
          //修改成功后要跳转到讲师列表页面
          this.$router.push({path: '/teacher/table'})
        })
      }
    }
  }

</script>

<style>

</style>
