<template>
  <el-form size="mini" status-icon :rules="rules" ref="ruleForm" :model="ruleForm" label-width="80px">
   <el-form-item label="地址" prop="url" title="地址">
      <el-input v-model="ruleForm.url"></el-input>
    </el-form-item>
   <el-form-item label="节点外部标识参数名" prop="key" title="节点外部标识参数名">
      <el-input v-model="ruleForm.key"></el-input>
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
    name: 'addApi',
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
          uid: null,
          url: null,
          key: null,
          createTime: 'CURRENT_TIMESTAMP',
          updateTime: 'CURRENT_TIMESTAMP',
          deleted: 0
        },
        rules: {
          id: [
            { validator: check, trigger: 'blur' }
          ],
          uid: [
            { validator: check, trigger: 'blur' }
          ],
          url: [
            { validator: check, trigger: 'blur' }
          ],
          key: [
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
