<template>
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
             	<el-option label="报告ID<TK-XXX-JKTJ-2018-0001>" value="id"></el-option>
             	<el-option label="报告生成时间" value="createTime"></el-option>
             	<el-option label="操作员" value="uname"></el-option>
             	<el-option label="<体检>发起时间" value="beginTime"></el-option>
             	<el-option label="<体检>结束时间" value="finishTime"></el-option>
             	<el-option label="故障对象<编号>" value="targetId"></el-option>
             	<el-option label="故障<现象>描述" value="description"></el-option>
             	<el-option label="发现故障时间" value="detectTime"></el-option>
             	<el-option label="解决故障时间" value="resolveTime"></el-option>
             	<el-option label="故障类型<硬件|软件>" value="hardware"></el-option>
             	<el-option label="告警部件" value="parts"></el-option>
             	<el-option label="告警次数" value="times"></el-option>
             	<el-option label="算法模型<编号>" value="algorithmId"></el-option>
             	<el-option label="<诊断>排查方式<自动|人工>" value="maual"></el-option>
             	<el-option label="纠正<解决>措施" value="measures"></el-option>
             	<el-option label="影响域分析" value="effect"></el-option>
             	<el-option label="<回归>测试验证" value="verify"></el-option>
             	<el-option label="解决方案<软件升级模块|硬件维修方式>" value="solution"></el-option>
             	<el-option label="维修措施、装备维修记录" value="maintenance"></el-option>
             	<el-option label="后续<检查维护>建议" value="advice"></el-option>
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
          <el-button type="primary" @click="restore" size="mini" icon="el-icon-plus">批量恢复</el-button>
          <el-button type="primary" @click="deletes" size="mini" icon="el-icon-minus">批量永久删除</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="tableData" border style="width: 100%" height="70vh">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column  prop="id"   label="报告ID<TK-XXX-JKTJ-2018-0001>"> </el-table-column>
      <el-table-column  prop="createTime"   label="报告生成时间"> </el-table-column>
      <el-table-column  prop="uname"   label="操作员"> </el-table-column>
      <el-table-column  prop="beginTime"   label="<体检>发起时间"> </el-table-column>
      <el-table-column  prop="finishTime"   label="<体检>结束时间"> </el-table-column>
      <el-table-column  prop="targetId"   label="故障对象<编号>"> </el-table-column>
      <el-table-column  prop="description"   label="故障<现象>描述"> </el-table-column>
      <el-table-column  prop="detectTime"   label="发现故障时间"> </el-table-column>
      <el-table-column  prop="resolveTime"   label="解决故障时间"> </el-table-column>
      <el-table-column  prop="hardware"   label="故障类型<硬件|软件>"> </el-table-column>
      <el-table-column  prop="parts"   label="告警部件"> </el-table-column>
      <el-table-column  prop="times"   label="告警次数"> </el-table-column>
      <el-table-column  prop="algorithmId"   label="算法模型<编号>"> </el-table-column>
      <el-table-column  prop="maual"   label="<诊断>排查方式<自动|人工>"> </el-table-column>
      <el-table-column  prop="measures"   label="纠正<解决>措施"> </el-table-column>
      <el-table-column  prop="effect"   label="影响域分析"> </el-table-column>
      <el-table-column  prop="verify"   label="<回归>测试验证"> </el-table-column>
      <el-table-column  prop="solution"   label="解决方案<软件升级模块|硬件维修方式>"> </el-table-column>
      <el-table-column  prop="maintenance"   label="维修措施、装备维修记录"> </el-table-column>
      <el-table-column  prop="advice"   label="后续<检查维护>建议"> </el-table-column>
      <el-table-column fixed="right"  label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="restore(scope.row)">恢复</el-button>
          <el-button type="text" size="mini" @click="delete(scope.row)">永久删除</el-button>
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
            <el-form-item label="<体检>发起时间">
              <el-input v-model="dialogData.beginTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="<体检>结束时间">
              <el-input v-model="dialogData.finishTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="故障对象<编号>">
              <el-input v-model="dialogData.targetId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="故障<现象>描述">
              <el-input v-model="dialogData.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="发现故障时间">
              <el-input v-model="dialogData.detectTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="解决故障时间">
              <el-input v-model="dialogData.resolveTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="故障类型<硬件|软件>">
              <el-radio-group size="mini" v-model="dialogData.hardware">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="告警部件">
              <el-input v-model="dialogData.parts"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="告警次数">
              <el-input v-model="dialogData.times"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="算法模型<编号>">
              <el-input v-model="dialogData.algorithmId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="<诊断>排查方式<自动|人工>">
              <el-radio-group size="mini" v-model="dialogData.maual">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="纠正<解决>措施">
              <el-input v-model="dialogData.measures"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="影响域分析">
              <el-input v-model="dialogData.effect"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="<回归>测试验证">
              <el-input v-model="dialogData.verify"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="解决方案<软件升级模块|硬件维修方式>">
              <el-input v-model="dialogData.solution"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="维修措施、装备维修记录">
              <el-input v-model="dialogData.maintenance"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
     	<el-row>
          <el-col :span="24">
            <el-form-item label="后续<检查维护>建议">
              <el-input v-model="dialogData.advice"></el-input>
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
</template>

<script>
  export default {
    name: 'device',
    data () {
      return {
        searchContent: '',
        searchSelect: '',
        deviceData: [],
        selectContent : '',
        tablePage: 1,
        tableSize: 100,
        tableTotle: 0,
        saveType: 'update',
        dialog: false,
        tableData: [],
        dialogData: {}
      }
    },
    created () {
      this.getDevice()
      this.getStruct(null, (this.tablePage - 1) * this.tableSize, this.tableSize)
    },
    methods: {
      // 获取设备
      getDevice () {
        this.$http.post('/api/fta/faultReport/get', {n: 0, l: 1000}).then((response) => {
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
      // 获取设备结构体
      getStruct(id, n, l) {
        let start = n? n : 0
        let end = l? l : this.tableSize
        let deviceData = this.deviceData
        if (id) {
          for (let i = 0; i < deviceData.length; i++) {
            if (id === deviceData[i].id) {
              console.log(deviceData[i]);
              this.$http.post('/api/fta/faultReport/get', {id: deviceData[i].$device_struct_ibfk_2, deleted: 0, n: 0, l: 100}).then((response) => {
                if (response.status === 200) {
                  this.tableData = response.data.d
                  this.tableTotle = response.data.t
                }
              })
            }
          }
        } else {
          this.$http.post('/api/fta/faultReport/get', {deleted: 1, n: start, l: end}).then((response) => {
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
        this.$http.post('/api/fta/faultReport/get', data).then((response) => {
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
			description: null,
			detectTime: null,
			resolveTime: null,
			hardware: null,
			parts: null,
			times: null,
			algorithmId: null,
			maual: null,
			measures: null,
			effect: null,
			verify: null,
			solution: null,
			maintenance: null,
			advice: null
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
        	description: this.dialogData.description,
        	detectTime: this.dialogData.detectTime,
        	resolveTime: this.dialogData.resolveTime,
        	hardware: this.dialogData.hardware,
        	parts: this.dialogData.parts,
        	times: this.dialogData.times,
        	algorithmId: this.dialogData.algorithmId,
        	maual: this.dialogData.maual,
        	measures: this.dialogData.measures,
        	effect: this.dialogData.effect,
        	verify: this.dialogData.verify,
        	solution: this.dialogData.solution,
        	maintenance: this.dialogData.maintenance,
        	advice: this.dialogData.advice
        }
        // 新添
        if (this.saveType === 'create') {
          this.$http.post('/api/fta/faultReport/add', data).then((response) => {
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
          this.$http.post('/api/fta/faultReport/put', data).then((response) => {
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
      // 恢复
      restore (row) {
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
      // 删除
      deletes (row) {
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
        this.getStruct(null, (this.tablePage - 1) * val, val)
      },
      // 页面页数
      tableCurrentChange(val) {
        this.getStruct(null, (val - 1) * this.tableSize, this.tableSize)
      },
      // 关闭模态框
      createClose () {
        this.dialog = false
      }
    }
  }
</script>
