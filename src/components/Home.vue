<template>
  <el-container>
    <el-aside width="auto">
      <el-menu
        default-active="1-1"
        :default-openeds="[1]"
        class="el-menu-vertical-demo"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#ffd04b"
        :router="true"
        :collapse-transition="false"
        :collapse="isCollapse">
        <el-menu-item index="0" route="/">
          <i class="iconfont icon-Group"></i>
          <span class="logo-title">故障树诊断</span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">故障树</span>
          </template>
          <el-menu-item-group>
            <el-menu-item route="/" index="1-1">故障树</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <span slot="title">分组一</span>
            <el-menu-item index="1-2">选项1</el-menu-item>
            <el-menu-item index="1-3">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-4">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-5">
            <span slot="title">选项4</span>
            <el-menu-item index="1-5-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">导航一</span>
          </template>
          <el-menu-item-group>
            <span slot="title">分组一</span>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="2-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="2-4">
            <span slot="title">选项4</span>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <span slot="title">导航三</span>
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
          active-text-color="#ffd04b">
          <el-menu-item @click="isCollapse = !isCollapse" index="1">
            <i v-if="isCollapse" class="iconfont icon-zhankai"></i>
            <i v-if="!isCollapse" class="iconfont icon-shouqi"></i>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">系统管理员：{{uname}}</template>
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
        uname: '',
        isCollapse: true
      }
    },
    computed: {
      users: function () {
        this.uname = this.$store.state.User.name
        return this.$store.state.User
      }
    },
    mounted () {
      this.uname = this.$cookies.get('uname')
    },
    methods: {
      logout () {
        this.$cookies.remove('uname')
        this.$cookies.remove('t')
        this.$router.push({path: '/'})
      }
    }
  }
</script>

<style>
  @import "../assets/css/home.css";
</style>
