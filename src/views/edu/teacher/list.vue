<template>
  <div class="app-container">

    <!--查询条件-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" clearable placeholder="讲师名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item >
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
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
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80"/>

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="简介"/>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除
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
      @current-change="getList"
    />
  </div>
</template>
<script>
  import teacher from '@/api/edu/teacher'

  export default {
    components: {teacher},
    //当前页面使用的数据变量和初始值
    data() {
      return {
        list: null,
        total: 0,
        page: 1,
        limit: 5,
        teacherQuery: {},
        tableData: [],
      }
    },
    //在页面渲染之前执行，一般是调用Method方法
    created() {
      this.getList()
    },
    //创建具体的方法，调用的是teacher.js
    methods: {
      getList(page = 1) {
        this.page = page
        teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery).then(response => {
          //请求成功
          console.log(response)
          this.total = response.data.total;
          this.tableData = response.data.items;
          console.log(total)
          console.log(tableData + "++++++++++")

        })//请求失败
          .catch(error => {
            console.log(error)
          })
      },
      resetData() {
        this.teacherQuery = {}
        this.getList()
      },
      removeDataById(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          teacher.deleteTeacher(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            //再次刷新页面
            this.getList()
          })
        })
      }
    },

  }

</script>
<style>

</style>
