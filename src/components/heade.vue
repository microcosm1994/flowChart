<template>
  <div class="heade">
    <el-row :gutter="20">
      <el-col :span="18">
        <h1><a href="http://localhost:63342/fta/fta.htm" class="title">{{title}}</a></h1>
      </el-col>
      <el-col :span="6">
        <div class="auth">
          <span>系统管理员</span>
          <el-dropdown @command="logout">
      <span class="el-dropdown-link">
      {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'heade',
    data () {
      return {
        title: '故障诊断',
        username: '',
      }
    },
    mounted () {
      this.username = this.$cookies.get('uname')

    },
    methods: {
      logout () {
        this.$cookies.remove('t')
        this.$router.push({path: '/login'})
      },

    }
  }
</script>

<style scoped>
  @import "../assets/css/heade.css";
  .title{
    color:#fff;
  }
</style>
