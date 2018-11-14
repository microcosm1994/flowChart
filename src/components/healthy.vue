<template>
  <el-container>
    <!--头部-->
    <el-header>
      <div style="padding-top: 20px;">
        <el-row :gutter="20">
          <el-col :span="8">
            <div style="text-align: center">
              <el-date-picker
                type="dates"
                size="mini"
                v-model="pickerDate"
                placeholder="选择一个或多个日期">
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="10">
            <div style="text-align: center">
              <el-input size="mini" placeholder="请输入内容" v-model="select.val" class="input-with-select">
                <el-select v-model="select.key" slot="prepend" placeholder="请选择">
                  <el-option label="餐厅名" value="1"></el-option>
                  <el-option label="订单号" value="2"></el-option>
                  <el-option label="用户电话" value="3"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div style="text-align: center">
              <el-button size="mini" @click="refresh" icon="el-icon-refresh" type="primary">刷新</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-main>
      <!--表格-->
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="id"
          label="报告ID"
          align="center"
          :show-overflow-tooltip="true"
          fixed="left"
          width="140">
        </el-table-column>
        <el-table-column
          prop="name"
          label="报告生成时间"
          align="center"
          :show-overflow-tooltip="true"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作员"
          align="center"
          :show-overflow-tooltip="true"
          width="140">
        </el-table-column>
        <el-table-column
          prop="address"
          label="体检对象"
          align="center"
          :show-overflow-tooltip="true"
          width="140">
        </el-table-column>
        <el-table-column
          prop="address"
          label="体检类别"
          align="center"
          :show-overflow-tooltip="true"
          width="140">
        </el-table-column>
        <el-table-column
          prop="address"
          label="体检项目"
          align="center"
          :show-overflow-tooltip="true"
          widyh="140">
        </el-table-column>
        <el-table-column
          prop="address"
          label="算法模型"
          align="center"
          :show-overflow-tooltip="true"
          width="140">
        </el-table-column>
        <el-table-column
          prop="address"
          label="权值选定"
          align="center"
          :show-overflow-tooltip="true"
          width="140">
        </el-table-column>
        <el-table-column
          prop="address"
          label="数据描述"
          align="center"
          :show-overflow-tooltip="true"
          width="140">
        </el-table-column>
        <el-table-column
          prop="address"
          label="评估结果"
          align="center"
          :show-overflow-tooltip="true"
          width="140">
        </el-table-column>
        <el-table-column
          prop="address"
          label="预测结果"
          align="center"
          :show-overflow-tooltip="true"
          width="140">
        </el-table-column>
        <el-table-column
          prop="address"
          label="维护建议"
          align="center"
          :show-overflow-tooltip="true"
          width="140">
        </el-table-column>
        <el-table-column
          fixed="right"
          width="200"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="view(scope.row)">查看</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div size="mini" class="page-box" style="text-align: center">
        <el-pagination
          size="mini"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[20, 30, 50, 100]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: 'healthy',
    data () {
      return {
        select: { // 搜索框选择
          key: '',
          val: ''
        },
        tableData: [], // 表格数据
        pagination: { // 分页
          total: 0,
          page: 1,
          size: 20
        },
        pickerDate: '', // 日期选择
      }
    },
    mounted () {},
    methods: {
      // 获取数据
      get () {

      },
      // 查看
      view (row) {

      },
      // 删除
      del (row) {

      },
      // 搜索
      search () {

      },
      // 刷新
      refresh () {},
      // 表格变色
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row'
        } else if (rowIndex === 3) {
          return 'success-row'
        }
        return ''
      },
      // 改变每页显示条数
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
      },
      // 改变页数
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
      }
    }
  }
</script>
