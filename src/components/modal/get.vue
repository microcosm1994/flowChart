<template>
  <el-form size="mini" :model="ruleForm" label-width="80px">
    <el-form-item label="标题">
      <el-input v-model="ruleForm.title" disabled></el-input>
    </el-form-item>
    <el-form-item label="key">
      <el-input v-model="ruleForm.key" disabled></el-input>
    </el-form-item>
    <el-form-item label="选中">
      <el-input v-model="ruleForm.selected" disabled></el-input>
    </el-form-item>
    <el-form-item label="确认">
      <el-input v-model="ruleForm.confirm" disabled></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="ruleForm.remark" disabled></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="ruleForm.end" disabled></el-input>
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
    <el-form-item>
      <div style="text-align: center">
        <el-button @click="resetForm()">关闭</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'put',
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
      currentnNode: function () {
        return this.$store.state.currentnNode
      }
    },
    mounted () {
      this.ruleForm = this.currentnNode
    },
    methods: {
      // 清除表单内容并关闭弹框
      resetForm() {
        // 重置data数据
        Object.assign(this.$data, this.$options.data())
        // 关闭弹框
        this.$store.commit('modal', {
          title: '查看节点',
          name: 'get',
          switch: false
        })
      }
    }
  }
</script>
