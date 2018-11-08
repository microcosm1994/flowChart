<template>
  <el-tabs type="border-card">
    <el-tab-pane label="消息中心">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix header-box">
          <el-row>
            <el-col :span="4">
              <div class="title">
                健康体检报告
              </div>
            </el-col>
            <el-col :span="8">
              <div class="search-box">
                <el-input placeholder="请输入搜索内容" v-model="searchContent" class="input-with-select" size="mini" @keyup.native.13="search">
                  <el-select v-model="searchSelect" slot="prepend" placeholder="请选择">
                    <el-option label="报告ID<TK-XXX-ZBGL-2018-0001>" value="id"></el-option>
                    <el-option label="报告生成时间" value="createTime"></el-option>
                    <el-option label="操作员" value="uname"></el-option>
                    <el-option label="<统计>开始时间" value="beginTime"></el-option>
                    <el-option label="<统计>结束时间" value="finishTime"></el-option>
                    <el-option label="管理对象<编号>" value="targetId"></el-option>
                    <el-option label="装备属性<用途、研值单位、列装时间、运行时间>" value="properties"></el-option>
                    <el-option label="故障分析<故障数量、类型、部件图表>" value="faultAnalysis"></el-option>
                    <el-option label="可靠性评定" value="reliability"></el-option>
                    <el-option label="升级改造" value="upgrades"></el-option>
                    <el-option label="技术更动" value="changes"></el-option>
                    <el-option label="装备维护" value="maintenance"></el-option>
                    <el-option label="综合评定" value="evaluation"></el-option>
                  </el-select>
                  <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="select-box">
                <el-select size="mini" v-model="selectContent" placeholder="请选择" @change="getStruct">
                  <el-option label="空" :value="null">
                  </el-option>
                  <el-option v-for="item in deviceData" :key="item.id" :label="item.chinese" :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="create" size="mini" icon="el-icon-plus">新添健康体检报告</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="tableData" :header-row-style="{height: '70px'}" border style="width: 100%" height="70vh" :stripe="true">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column  prop="id"   label="报告ID<TK-XXX-ZBGL-2018-0001>"> </el-table-column>
          <el-table-column  prop="createTime"   label="报告生成时间"> </el-table-column>
          <el-table-column  prop="uname"   label="操作员"> </el-table-column>
          <el-table-column  prop="beginTime"   label="<统计>开始时间"> </el-table-column>
          <el-table-column  prop="finishTime"   label="<统计>结束时间"> </el-table-column>
          <el-table-column  prop="targetId"   label="管理对象<编号>"> </el-table-column>
          <el-table-column  prop="properties"   label="装备属性<用途、研值单位、列装时间、运行时间>"> </el-table-column>
          <el-table-column  prop="faultAnalysis"   label="故障分析<故障数量、类型、部件图表>"> </el-table-column>
          <el-table-column  prop="reliability"   label="可靠性评定"> </el-table-column>
          <el-table-column  prop="upgrades"   label="升级改造"> </el-table-column>
          <el-table-column  prop="changes"   label="技术更动"> </el-table-column>
          <el-table-column  prop="maintenance"   label="装备维护"> </el-table-column>
          <el-table-column  prop="evaluation"   label="综合评定"> </el-table-column>
          <el-table-column fixed="right"  label="操作" width="150px">
            <template slot-scope="scope">
              
              <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" size="mini" @click="remove(scope.row)">删除</el-button>
             </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center">
          <el-pagination
                  @size-change="tableSizeChange"
                  @current-change="tableCurrentChange"
                  :current-page="tablePage"
                  :page-sizes="[50, 100, 200, 500]"
                  :page-size="tableSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="tableTotle">
          </el-pagination>
        </div>
        <el-dialog title="新添健康体检报告" :visible="dialog" width="40%" :before-close="createClose">
          <el-form ref="dialogData" :model="dialogData" label-width="140px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="操作员">
                  <el-input v-model="dialogData.uname"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="<统计>开始时间">
                  <el-input v-model="dialogData.beginTime"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="<统计>结束时间">
                  <el-input v-model="dialogData.finishTime"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="管理对象<编号>">
                  <el-input v-model="dialogData.targetId"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="装备属性<用途、研值单位、列装时间、运行时间>">
                  <el-input v-model="dialogData.properties"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="故障分析<故障数量、类型、部件图表>">
                  <el-input v-model="dialogData.faultAnalysis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="可靠性评定">
                  <el-input v-model="dialogData.reliability"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="升级改造">
                  <el-input v-model="dialogData.upgrades"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="技术更动">
                  <el-input v-model="dialogData.changes"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="装备维护">
                  <el-input v-model="dialogData.maintenance"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="综合评定">
                  <el-input v-model="dialogData.evaluation"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialog = false">取 消</el-button>
            <el-button type="primary" @click="save()"  @keyup.native.13="save()">确 定</el-button>
          </div>
        </el-dialog>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="回收站">
      <get1></get1>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import get1 from './get1'
  export default {
    name: 'device',
    data () {
      return {
        searchContent: '', // 搜索内容
        searchSelect: '', // 搜索选项
        deviceData: [], // 设备数据
        selectContent : '', // 选择内容
        tablePage: 1, // 表格页数
        tableSize: 100, // 表格显示的数据条数
        tableTotle: 0, // 表格数据的总数
        saveType: 'update', // 保存按钮的类型，uptade为更新数据（修改后保存），create为新建
        dialog: false, // 模态框
        tableData: [], //表格数据
        dialogData: {} // 模态框中的数据
      }
    },
    components: {
        get1
    },
    computed: {
        parent_id: function () {
        let parent_id = this.$route.query.parent_id
        if (!parent_id) {
            parent_id = null
        }
        return parent_id
      }
    },
    watch: {
      deviceData: function (_new, old) {
        this.getStruct(this.parent_id, (this.tablePage - 1) * this.tableSize, this.tableSize)
      }
    },
    mounted () {
      this.getDevice()
      if (!this.parent_id) {
          this.getStruct(this.parent_id, (this.tablePage - 1) * this.tableSize, this.tableSize)
      }
    },
    methods: {
      // 获取设备
      getDevice () {
        this.$http.post('/api/fta/deviceReport/get', {n: 0, l: 1000}).then((response) => {
          if (response.status === 200) {
            let name = ''
            this.deviceData = response.data.d
            for (let i = 0; i < response.data.d.length; i++) {
              name = response.data.d[i].id + '--' + response.data.d[i].chinese
              this.deviceData[i].chinese = name
            }
          }
        })
      },
      /**
       * 获取设备结构体
       * @id:父级结构的id
       * @n:页数
       * @l:数据数量
       * */
      getStruct(id, n, l) {
        let start = n? n : 0
        let end = l? l : this.tableSize
        let deviceData = this.deviceData
        if (id) {
          for (let i = 0; i < deviceData.length; i++) {
            if (id - 0 === deviceData[i].parent_id) {
              this.$http.post('/api/fta/deviceReport/get', {parent_id: id, deleted: 0, n: 0, l: 100}).then((response) => {
                if (response.status === 200) {
                  this.tableData = response.data.d
                  this.tableTotle = response.data.t
                }
              })
            }
          }
        } else {
          this.$http.post('/api/fta/deviceReport/get', {deleted: 0, n: start, l: end}).then((response) => {
            if (response.status === 200) {
              this.tableData = response.data.d
              this.tableTotle = response.data.t
            }
          })
        }
      },
      // 搜索
      search () {
        let type = this.searchSelect
        let data = {}
        data.delete = 0
        if (type === 'id') {
          data['id'] = this.searchContent
        }
        if (type === 'name') {
          data['name%'] = this.searchContent
        }
        if (type === 'chinese') {
          data['chinese%'] = this.searchContent
        }
        this.$http.post('/api/fta/deviceReport/get', data).then((response) => {
          if (response.status === 200) {
            this.tableData = response.data.d
            this.tableTotle = response.data.t
          }
        })
      },
      // 编辑
      edit (row) {
        this.saveType = 'edit'
        this.dialogData = row
        this.dialog = true
      },
      // 新添
      create () {
        this.dialogData = {
			id: null,
			uname: null,
			beginTime: null,
			finishTime: null,
			targetId: null,
			properties: null,
			faultAnalysis: null,
			reliability: null,
			upgrades: null,
			changes: null,
			maintenance: null,
			evaluation: null
        }
        this.saveType = 'create'
        this.dialog = true
      },
      // 保存
      save () {
        let data = {
        	id: this.dialogData.id,
        	uname: this.dialogData.uname,
        	beginTime: this.dialogData.beginTime,
        	finishTime: this.dialogData.finishTime,
        	targetId: this.dialogData.targetId,
        	properties: this.dialogData.properties,
        	faultAnalysis: this.dialogData.faultAnalysis,
        	reliability: this.dialogData.reliability,
        	upgrades: this.dialogData.upgrades,
        	changes: this.dialogData.changes,
        	maintenance: this.dialogData.maintenance,
        	evaluation: this.dialogData.evaluation
        }
        // 新添
        if (this.saveType === 'create') {
          this.$http.post('/api/fta/deviceReport/add', data).then((response) => {
            if (response.status === 200) {
              data.id = response.data.d
              this.tableData.push(data)
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.dialog = false
            }
          })
        }
        // 编辑
        if (this.saveType === 'edit') {
          data.id = this.dialogData.id
          this.$http.post('/api/fta/deviceReport/put', data).then((response) => {
            if (response.status === 200) {
              for (let i = 0; i < this.tableData.length; i++) {
                if (data.id === this.tableData[i].id) {
                  this.tableData[i] = data
                }
              }
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.dialog = false
            }
          })
        }
      },
      // 关联跳转
      jump (row, url) {
        this.$router.push({
          path: url,
          query: {
              parent_id: row.id
          }
        })
      },
      // 删除
      remove (row) {
        this.$confirm('是否删除这个健康体检报告？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          console.log(1);
        }).catch(action => {
          console.log(2);
        });
      },
      // 页面显示条数
      tableSizeChange(val) {
        this.getStruct(this.parent_id, (this.tablePage - 1) * val, val)
      },
      // 页面页数
      tableCurrentChange(val) {
        this.getStruct(this.parent_id, (val - 1) * this.tableSize, this.tableSize)
      },
      // 关闭模态框
      createClose () {
        this.dialog = false
      }
    }
  }
</script>
