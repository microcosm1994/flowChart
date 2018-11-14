<template>
  <el-form size="mini" :model="ruleForm" label-width="80px">
    <el-form-item label="标题">
      <el-input v-model="ruleForm.title" disabled></el-input>
    </el-form-item>
    <el-form-item label="key">
      <el-input v-model="ruleForm.key" disabled></el-input>
    </el-form-item>
    <el-form-item label="选中" prop="selected">
      <el-radio-group v-model="ruleForm.selected" disabled>
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="确认" prop="confirm">
      <el-radio-group v-model="ruleForm.confirm" disabled>
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="底层" prop="end">
      <el-radio-group v-model="ruleForm.end" disabled>
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="评分0">
      <el-input v-model="ruleForm.score0" disabled></el-input>
    </el-form-item>
    <el-form-item label="评分1">
      <el-input v-model="ruleForm.score1" disabled></el-input>
    </el-form-item>
    <el-form-item label="评分2">
      <el-input v-model="ruleForm.score2" disabled></el-input>
    </el-form-item>
    <el-form-item label="评分3">
      <el-input v-model="ruleForm.score3" disabled></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input
        type="textarea"
        autosize
        placeholder="请输入内容"
        disabled
        v-model="ruleForm.remark">
      </el-input>
    </el-form-item>
    <el-form-item>
      <div style="text-align: center">
        <el-button type="danger" @click="submitForm('ruleForm')">删除</el-button>
        <el-button @click="resetForm()">取消</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'remove',
    data () {
      return {
        ruleForm: {
          title: '',
          key: '',
          selected: '',
          confirm: '',
          remark: '',
          end: '',
          score0: '',
          score1: '',
          score2: '',
          score3: '',
        }
      }
    },
    computed: {
      diagram: function () {
        return this.$store.state.diagram
      },
      currentnNode: function () {
        return this.$store.state.currentnNode
      }
    },
    mounted () {
      this.ruleForm = this.currentnNode
    },
    methods: {
      // 提交表单
      submitForm() {
        let diagram = this.diagram
        diagram.removeObj(this.ruleForm)
        // 保存json数据到vuex
        this.$store.commit('sourceCode', diagram.modelData())
        this.resetForm()
      },
      // 清除表单内容并关闭弹框
      resetForm() {
        // 重置data数据
        Object.assign(this.$data, this.$options.data())
        // 关闭弹框
        this.$store.commit('modal', {
          title: '确认删除此节点？',
          name: 'del',
          switch: false
        })
      }
    }
  }
</script>
