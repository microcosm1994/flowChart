<template>
  <el-tabs type="border-card">
    <el-tab-pane label="消息中心">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix header-box">
          <el-row>
            <el-col :span="4">
              <div class="title">
                节点
              </div>
            </el-col>
            <el-col :span="8">
              <div class="search-box">
                <el-input placeholder="请输入搜索内容" v-model="searchContent" class="input-with-select" size="mini" @keyup.native.13="search">
                  <el-select v-model="searchSelect" slot="prepend" placeholder="请选择">
                    <el-option label="主键" value="key"></el-option>
                    <el-option label="用户" value="uid"></el-option>
                    <el-option label="创建" value="createTime"></el-option>
                    <el-option label="更新" value="updateTime"></el-option>
                    <el-option label="删除" value="deleted"></el-option>
                    <el-option label="接口" value="api"></el-option>
                    <el-option label="评分0" value="score0"></el-option>
                    <el-option label="评分1" value="score1"></el-option>
                    <el-option label="评分2" value="score2"></el-option>
                    <el-option label="评分3" value="score3"></el-option>
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
              <el-button type="primary" @click="create" size="mini" icon="el-icon-plus">新添节点</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="tableData" :header-row-style="{height: '70px'}" border style="width: 100%" height="70vh" :stripe="true">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column  prop="key"   label="主键"> </el-table-column>
          <el-table-column  prop="uid"   label="用户"> </el-table-column>
          <el-table-column  prop="createTime"   label="创建"> </el-table-column>
          <el-table-column  prop="updateTime"   label="更新"> </el-table-column>
          <el-table-column  prop="api"   label="接口"> </el-table-column>
          <el-table-column  prop="score0"   label="评分0"> </el-table-column>
          <el-table-column  prop="score1"   label="评分1"> </el-table-column>
          <el-table-column  prop="score2"   label="评分2"> </el-table-column>
          <el-table-column  prop="score3"   label="评分3"> </el-table-column>
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
        <el-dialog title="新添节点" :visible="dialog" width="40%" :before-close="createClose">
          <el-form ref="dialogData" :model="dialogData" label-width="140px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="用户">
                  <el-input v-model="dialogData.uid"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="接口">
                  <el-input v-model="dialogData.api"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="评分0">
                  <el-input v-model="dialogData.score0"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="评分1">
                  <el-input v-model="dialogData.score1"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="评分2">
                  <el-input v-model="dialogData.score2"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="评分3">
                  <el-input v-model="dialogData.score3"></el-input>
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
        this.$http.post('/api/fta/parent/get', {n: 0, l: 1000}).then((response) => {
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
              this.$http.post('/api/fta/parent/get', {parent_id: id, deleted: 0, n: 0, l: 100}).then((response) => {
                if (response.status === 200) {
                  this.tableData = response.data.d
                  this.tableTotle = response.data.t
                }
              })
            }
          }
        } else {
          this.$http.post('/api/fta/parent/get', {deleted: 0, n: start, l: end}).then((response) => {
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
        this.$http.post('/api/fta/parent/get', data).then((response) => {
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
			key: null,
			uid: null,
			api: null,
			score0: '0',
			score1: '0',
			score2: '0',
			score3: '0'
        }
        this.saveType = 'create'
        this.dialog = true
      },
      // 保存
      save () {
        let data = {
        	key: this.dialogData.key,
        	uid: this.dialogData.uid,
        	api: this.dialogData.api,
        	score0: this.dialogData.score0,
        	score1: this.dialogData.score1,
        	score2: this.dialogData.score2,
        	score3: this.dialogData.score3
        }
        // 新添
        if (this.saveType === 'create') {
          this.$http.post('/api/fta/parent/add', data).then((response) => {
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
          this.$http.post('/api/fta/parent/put', data).then((response) => {
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
        this.$confirm('是否删除这个节点？', '确认信息', {
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
