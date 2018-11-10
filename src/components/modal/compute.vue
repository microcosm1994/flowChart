<template>
  <el-form size="mini" ref="form" :model="compute" label-width="80px">
    <el-form-item label="分数1">
      <el-input v-model="compute.score0" disabled></el-input>
    </el-form-item>
    <el-form-item label="分数2">
      <el-input v-model="compute.score1" disabled></el-input>
    </el-form-item>
    <el-form-item label="分数3">
      <el-input v-model="compute.score2" disabled></el-input>
    </el-form-item>
    <el-form-item label="分数4">
      <el-input v-model="compute.score3" disabled></el-input>
    </el-form-item>
    <el-form-item>
      <div style="text-align: center">
        <el-button type="primary" @click="onSubmit">计算</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'compute',
    data () {
      return {}
    },
    computed: {
      compute: function () {
        return this.$store.state.compute
      }
    },
    mounted () {},
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      cancel () {
        // 关闭弹框
        this.$store.commit('modal', {
          title: '计算',
          name: 'compute',
          switch: false
        })
      }
    }
  }
</script>
