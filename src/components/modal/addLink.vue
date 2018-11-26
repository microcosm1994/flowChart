<template>
  <el-form size="mini" status-icon :rules="rules" ref="ruleForm" :model="ruleForm" label-width="80px">
    <el-form-item label="源" prop="title">
      <el-input v-model="ruleForm.from"></el-input>
    </el-form-item>
    <el-form-item label="目标" prop="selected">
      <el-input v-model="ruleForm.to"></el-input>
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
    name: 'addLink',
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
          from: '',
          to: ''
        },
        rules: {
          from: [
            { validator: check, trigger: 'blur' }
          ],
          to: [
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
    mounted () {
      this.ruleForm.from = this.modalData.key
      this.ruleForm.to = this.modalData.key
    },
    methods: {
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$control.addLink(this.ruleForm)
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
