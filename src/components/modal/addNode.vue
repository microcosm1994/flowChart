<template>
  <el-form size="mini" status-icon :rules="rules" ref="ruleForm" :model="ruleForm" label-width="80px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="ruleForm.title"></el-input>
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
          remark: '',
          score0: 0,
          score1: 0,
          score2: 0,
          score3: 0,
        },
        rules: {
          title: [
            { validator: check, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      // 当前节点信息
      modalData: function () {
        return this.$store.state.modalData
      }
    },
    mounted () {},
    methods: {
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$control.addNode(this.modalData, this.ruleForm)
            // 关闭弹框
            this.resetForm()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 清除表单内容并关闭弹框
      resetForm() {
        // 重置data数据
        Object.assign(this.$data, this.$options.data())
        // 关闭弹框
        this.$store.commit('modal', false)
      }
    }
  }
</script>
