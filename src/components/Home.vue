<template>
  <el-container>
    <el-aside width="auto">
      <el-menu
        default-active="1-1"
        :default-openeds="[1]"
        class="el-menu-vertical-demo"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#009688"
        :router="true"
        :collapse-transition="false"
        :collapse="isCollapse">
        <el-menu-item index="0" route="/">
          <i>
            <img style="width: 45px;height: 45px;margin-left: -10px;margin-top: -15px" src="../assets/logo.png" alt="">
          </i>
          <span class="logo-title">故障树诊断</span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">故障树管理</span>
          </template>
          <el-menu-item index="1-1" route="/">
            <i class="el-icon-edit"></i>
            <span slot="title">故障树编辑</span>
          </el-menu-item>
          <el-menu-item-group title="故障树项目">
            <el-submenu index="1-5">
              <span slot="title">故障树列表</span>
              <el-menu-item index="1-5-1">列表1</el-menu-item>
              <el-menu-item index="1-5-1">列表2</el-menu-item>
              <el-menu-item index="1-5-1">列表3</el-menu-item>
            </el-submenu>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">全寿命周期管理</span>
          </template>
          <el-menu-item index="1-1" route="/">
            <i class="el-icon-edit"></i>
            <span slot="title">项目列表</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <span slot="title">综合健康体检</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-menu
          default-active="2"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#009688">
          <el-menu-item @click="isCollapse = !isCollapse" index="1">
            <i v-if="isCollapse" class="iconfont icon-zhankai"></i>
            <i v-if="!isCollapse" class="iconfont icon-shouqi"></i>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">系统管理员：{{users.name}}</template>
            <el-menu-item @click="logout" index="1-1">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {
        users: {
          name: ''
        },
        isCollapse: true
      }
    },
    mounted () {
      this.users.name = this.$cookies.get('uname')
      this.get()
    },
    methods: {
      get () {
        this.$http.post('/api/sys/menu/get', {n:0,l:1000,deleted: 0}).then((response) => {
          console.log(response);
        })
      },
      logout () {
        this.$cookies.remove('uname')
        this.$cookies.remove('t')
        this.$router.push({path: '/login'})
      }
    }
  }
</script>

<style>
  @import "../assets/css/Home.css";
</style>
