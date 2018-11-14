<template>
  <el-form size="mini" status-icon :rules="rules" ref="ruleForm" :model="ruleForm" label-width="80px">
    <el-form-item label="源" prop="title">
      <el-input v-model="ruleForm.from"></el-input>
    </el-form-item>
    <el-form-item label="目标" prop="selected">
      <el-input v-model="ruleForm.to"></el-input>
    </el-form-item>
    <el-form-item label="权重" prop="confirm">
      <el-input v-model="ruleForm.weight"></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="leaf">
      <el-input v-model="ruleForm.order"></el-input>
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
          to: '',
          weight: '',
          order: ''
        },
        rules: {
          from: [
            { validator: check, trigger: 'blur' }
          ],
          to: [
            { validator: check, trigger: 'blur' }
          ],
          weight: [
            { validator: check, trigger: 'blur' }
          ],
          order: [
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
    mounted () {
      this.ruleForm.from = this.currentnNode.key
      this.ruleForm.to = this.currentnNode.key
    },
    methods: {
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let diagram = this.diagram
            // 添加新节点
            this.addLink(this.ruleForm)
            // 关闭弹框
            this.resetForm()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 添加新连接
      addLink (data) {
        let diagram = this.diagram
        diagram.startTransaction('addLink start');
        // 建立新的连接
        diagram.model.addLinkData(data);
        // 更新
        diagram.updateLinkByData(data)
        diagram.commitTransaction('addLink commit');
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
          title: '添加连接',
          name: 'addLink',
          switch: false
        })
      }
    }
  }
</script>
