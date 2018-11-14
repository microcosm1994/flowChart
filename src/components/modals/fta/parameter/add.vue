<template>
  <el-form size="mini" status-icon :rules="rules" ref="ruleForm" :model="ruleForm" label-width="80px">
     <el-form-item label="节点" prop="api" title="节点">
      <el-input
        type="textarea"
        autosize
        placeholder="请输入内容"
        v-model="ruleForm.api">
      </el-input>
    </el-form-item>
   <el-form-item label="参数名" prop="parameter" title="<固定>参数名">
      <el-input v-model="ruleForm.parameter"></el-input>
    </el-form-item>
   <el-form-item label="参数值" prop="value" title="<固定>参数值">
      <el-input v-model="ruleForm.value"></el-input>
    </el-form-item>
     <el-form-item label="接口" prop="auto" title="接口">
      <el-radio-group v-model="ruleForm.auto">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <div style="text-align: center">
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
        <el-button @click="resetForm()">取消</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>~{field.defaultHtml}
  export default {
    name: 'addParameter',
    data () {
      let check = (rule, value, callback) => {
        if (value !== 0 && !value) {
          return callback(new Error('此项数据不能为空'));
        } else {
          callback()
        }
      };
      return {
        ruleForm: {
          id: null,
          api: null,
          uid: null,
          parameter: null,
          value: null,
          createTime: 'CURRENT_TIMESTAMP',
          updateTime: 'CURRENT_TIMESTAMP',
          deleted: 0,
          auto: 0
        },
        rules: {
          id: [
            { validator: check, trigger: 'blur' }
          ],
          api: [
            { validator: check, trigger: 'blur' }
          ],
          uid: [
            { validator: check, trigger: 'blur' }
          ],
          parameter: [
            { validator: check, trigger: 'blur' }
          ],
          createTime: [
            { validator: check, trigger: 'blur' }
          ],
          updateTime: [
            { validator: check, trigger: 'blur' }
          ],
          deleted: [
            { validator: check, trigger: 'blur' }
          ],
          auto: [
            { validator: check, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      diagram: function () {
        return this.$store.state.diagram
      },
      // 当前节点信息
      currentnNode: function () {
        return this.$store.state.currentnNode
      }
    },
    mounted () {},
    methods: {
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let diagram = this.diagram
            diagram.totalScore(this.ruleForm)
            // 添加新节点
            this.addNode(this.currentnNode, this.ruleForm)
            // 关闭弹框
            this.resetForm()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 添加节点
      addNode (parent, children) {
        let diagram = this.diagram
        diagram.startTransaction('addNode start');
        // 给新节点生成key
        diagram.model.makeNodeDataKeyUnique(children);
        // 添加节点
        diagram.model.addNodeData(children);
        // 与父节点建立连接
        diagram.model.addLinkData({
          from : parent.key,
          to : children.key,
          uid: parent.uid,
          weight: 1,
          order: 1,
          createTime: '',
          updateTime: Date.now(),
          deleted: 0
        });
        // 更新节点
        diagram.updateNodeByKey(this.currentnNode.key);
        diagram.commitTransaction('addNode commit');
        // 更新实例对象到vuex
        this.$store.commit('diagram', diagram)
        // 保存json数据到vuex
        this.$store.commit('sourceCode', diagram.modelData())
      },
      // 清除表单内容并关闭弹框
      resetForm() {
        // 重置data数据
        Object.assign(this.$data, this.$options.data())
        // 关闭弹框
        this.$store.commit('modal', {
          title: '添加节点',
          name: 'addNode',
          switch: false
        })
      }
    }
  }
</script>
