<template>
  <div class="app-container">

    <!--查询条件-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseSerachVO.title" clearable placeholder="课程名称"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseSerachVO.status" clearable placeholder="课程状态">
          <el-option value="Normal" label="发布"/>
          <el-option value="Draft" label="未发布"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="courseSerachVO.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="courseSerachVO.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getPageCourseCondition()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>


    <!--页面中间展示内容页面中间展示内容-->
    <el-table
      border
      fit
      highlight-current-row
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="序号"
        width="80"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="185"/>

      <el-table-column label="课程状态" width="185">
        <template slot-scope="scope">
          {{ scope.row.status==='Normal'?'发布':'未发布' }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数" width="185"/>

      <el-table-column prop="gmtCreate" label="添加时间" width="185"/>

      <el-table-column prop="viewCount" label="浏览量" width="185"/>
      <el-table-column label="操作" width="310" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改课程大纲信息</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--分页插件-->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getPageCourseCondition"
    />
  </div>
</template>
<script>
  import course from '@/api/edu/course'

  export default {
    components: {course},
    data() {
      return {
        total: 0,
        page: 1,
        limit: 5,
        tableData: [],
        courseSerachVO: {},
      }
    },
    created() {
      this.getPageCourseCondition();
    },
    methods: {
      //删除课程
      removeDataById(id) {
        this.$confirm('确定要删除该课程？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          course.deleteCourse(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功:)'
            })
            //再次刷新
            this.getPageCourseCondition()
          })
        })
      }
      ,
      //清空方法
      resetData() {
        this.courseSerachVO = {};
        this.getPageCourseCondition();
      }
      ,
      //获取表格中数据
      getPageCourseCondition(page = 1) {
        this.page = page;
        course.getCourseConditionList(this.page, this.limit, this.courseSerachVO).then(response => {
          this.total = response.data.total;
          this.tableData = response.data.items;
        })
      }
    },
  }

</script>
<style>

</style>
