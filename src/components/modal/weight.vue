<template>
  <el-form size="mini" status-icon :rules="rules" ref="ruleForm" :model="ruleForm" label-width="80px">
    <!--<el-form-item label="编号" prop="id">-->
      <!--<el-input v-model.number="ruleForm.id" disabled></el-input>-->
    <!--</el-form-item>-->
    <el-form-item label="权重0" prop="weight0">
      <el-input v-model.number="ruleForm.weight0"></el-input>
    </el-form-item>
    <el-form-item label="权重1" prop="weight1">
      <el-input v-model.number="ruleForm.weight1"></el-input>
    </el-form-item>
    <el-form-item label="权重2" prop="weight2">
      <el-input v-model.number="ruleForm.weight2"></el-input>
    </el-form-item>
    <el-form-item label="权重3" prop="weight3">
      <el-input v-model.number="ruleForm.weight3"></el-input>
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
      name: 'weight',
      data () {
        let check = (rule, value, callback) => {
          if (value !== 0 && !value) {
            return callback(new Error('此项数据不能为空'));
          } else {
            callback();
          }
        };
        return {
          ruleForm: {
            // id:'',
            weight0:'',
            weight1:'',
            weight2:'',
            weight3:'',
          },
          rules: {
            weight0: [
              { validator: check, trigger: 'blur' }
            ],
            weight1: [
              { validator: check, trigger: 'blur' }
            ],
           weight2: [
              { validator: check, trigger: 'blur' }
            ],
            weight3: [
              { validator: check, trigger: 'blur' }
            ],
          }
        }
      },
      computed: {
        diagram: function () {
          return this.$store.state.diagram
        },
        // 当前节点信息
        weight: function () {
          return this.$store.state.weight
        }
      },
      mounted () {
        for (let i = 0; i < this.weight.length; i++) {
          this.ruleForm['weight' + i] = this.weight[i]
        }
      },
      methods: {
        // 提交表单
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$http.post('/9001/fta/weight/put', this.ruleForm).then((response) => {
                if (response.status === 200) {
                  console.log(this.ruleForm);
                }
              });
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
          Object.assign(this.$data, this.$options.data());
          // 关闭弹框
          this.$store.commit('modal', {
            title: '权重',
            name: 'weight',
            switch: false
          })
        }
      }
    }
</script>

<style scoped>

</style>
