<template>
  <el-form size="mini" status-icon :rules="rules" ref="ruleForm" :model="ruleForm" label-width="80px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="ruleForm.title"></el-input>
    </el-form-item>
    <el-form-item label="选中" prop="selected">
      <el-radio-group v-model="ruleForm.selected">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="确认" prop="confirm">
      <el-radio-group v-model="ruleForm.confirm">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="底层" prop="end">
      <el-radio-group v-model="ruleForm.end">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="评分0" prop="score0">
      <el-input v-model="ruleForm.score0"></el-input>
    </el-form-item>
    <el-form-item label="评分1" prop="score1">
      <el-input v-model="ruleForm.score1"></el-input>
    </el-form-item>
    <el-form-item label="评分2" prop="score2">
      <el-input v-model="ruleForm.score2"></el-input>
    </el-form-item>
    <el-form-item label="评分3" prop="score3">
      <el-input v-model="ruleForm.score3"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input
        type="textarea"
        autosize
        placeholder="请输入内容"
        v-model="ruleForm.remark">
      </el-input>
    </el-form-item>
    <el-form-item>
      <div style="text-align: center">
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
        <el-button @click="resetForm()">取消</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'addNode',
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
          title: '',
          selected: '',
          confirm: '',
          end: '',
          remark: '',
          score0: 0,
          score1: 0,
          score2: 0,
          score3: 0,
        },
        rules: {
          title: [
            { validator: check, trigger: 'blur' }
          ],
          score0: [
            { validator: check, trigger: 'blur' }
          ],
          score1: [
            { validator: check, trigger: 'blur' }
          ],
          score2: [
            { validator: check, trigger: 'blur' }
          ],
          score3: [
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

<style scoped>

</style>
