<template>
  <el-container>
    <el-aside width="auto">
      <el-menu
        :default-active="active"
        class="el-menu-vertical-demo"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#009688"
        :router="true"
        size="mini"
        :collapse-transition="false"
        style="overflow-x: hidden;"
        :collapse="isCollapse">
        <el-scrollbar style="height: 100%;">
          <el-menu-item index="0" route="/">
            <i class="iconfont icon-Group">
              <!--<img style="width: 45px;height: 45px;margin-left: -10px;margin-top: -15px" src="../assets/logo.png" alt="">-->
            </i>
            <span v-if="!isCollapse" class="logo-title">健康管理</span>
          </el-menu-item>
          <el-menu-item index="1" route="/">
            <i class="el-icon-menu"></i>
            <span v-if="!isCollapse">流程图编辑</span>
          </el-menu-item>
        </el-scrollbar>
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
        active: '1',
        users: {
          name: ''
        },
        menuList: [],
        isCollapse: true
      }
    },
    mounted () {},
    methods: {}
  }
</script>

<style>
  @import "../assets/css/Home.css";
</style>
