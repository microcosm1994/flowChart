<template>
  <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="60px" size="mini" class="demo-ruleForm">
    <el-form-item label="主键" prop="key" title="主键">
      <el-input v-model="ruleForm.key" disabled></el-input>
    </el-form-item>
    <el-form-item label="标题" prop="title" title="标题">
      <el-input type="textarea" autosize placeholder="请输入内容" v-model="ruleForm.title" ref="title" maxLength="51"></el-input>
    </el-form-item>
    <el-form-item label="选中" prop="selected" title="<是否>选中">
      <el-radio-group v-model="ruleForm.selected">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="确认" prop="confirm" title="<是否弹出>确认">
      <el-radio-group v-model="ruleForm.confirm">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="底层" prop="end" title="<是否>底层<节点>">
      <el-select v-model="ruleForm.end" placeholder="请选择">
        <el-option :value="0" title="up" label="上层节点"></el-option>
        <el-option :value="1" title="api" label="需要请求外部接口得到分数"></el-option>
        <el-option :value="2" title="count" label="根据统计得到分数"></el-option>
        <el-option :value="3" title="function" label="根据概率函数得到分数"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="评分0" prop="score0" title="评分0<概率>">
      <el-input v-model="ruleForm.score0" maxLength="22"></el-input>
    </el-form-item>
    <el-form-item label="评分1" prop="score1" title="评分1<概率>">
      <el-input v-model="ruleForm.score1" maxLength="22"></el-input>
    </el-form-item>
    <el-form-item label="评分2" prop="score2" title="评分2<概率>">
      <el-input v-model="ruleForm.score2" maxLength="22"></el-input>
    </el-form-item>
    <el-form-item label="评分3" prop="score3" title="评分3<概率>">
      <el-input v-model="ruleForm.score3" maxLength="22"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark" title="备注">
      <el-input type="textarea" autosize placeholder="请输入内容" v-model="ruleForm.remark" maxLength="255"></el-input>
    </el-form-item>
    <div style="text-align: center">
      <el-button size="mini" type="primary" @click="submitForm('ruleForm')">保存</el-button>
      <el-button size="mini" @click="resetForm">取消</el-button>
    </div>
  </el-form>
</template>

<script>
  export default {
    name: 'put',
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
          key: null,
          title: null,
          selected: 1,
          confirm: 0,
          end: 0,
          score0: '0',
          score1: '0',
          score2: '0',
          score3: '0',
          remark: ''
        },
        rules: {
          title: [
            { validator: check, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      modalData: function () {
        return this.$store.state.modalData
      }
    },
    created () {
      this.get()
    },
    mounted () {},
    methods: {
      // 获取数据
      get () {
        let data = this.modalData
        for (let key in data) {
          this.ruleForm[key] = data[key]
        }
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$control.put(this.ruleForm)
            // 关闭模态框
            this.resetForm()
          } else {
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
