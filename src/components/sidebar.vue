<template>
  <div class="sidebar" v-bind:class="{open: !isCollapse, close: isCollapse}">
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" :router='true' :collapse-transition='false'>
      <div class="menuSwitch" index="0" @click="isCollapse = !isCollapse">
        <i v-if="!isCollapse" class="el-icon-arrow-left"></i>
        <i v-if="isCollapse" class="el-icon-arrow-right"></i>
        <span slot="title">{{isCollapse? '': '收起'}}</span>
      </div>
      <el-menu-item index="0" route="/fta/report/get">
        <i class="el-icon-location"></i>
        <span slot="title">报告历史数据</span>
      </el-menu-item>
      <el-menu-item index="1" route="/fta/ref/get">
        <i class="el-icon-location"></i>
        <span slot="title">连接</span>
      </el-menu-item>
      <el-menu-item index="2" route="/fta/end/get">
        <i class="el-icon-location"></i>
        <span slot="title">底节点</span>
      </el-menu-item>
      <el-menu-item index="3" route="/fta/obj/get">
        <i class="el-icon-location"></i>
        <span slot="title">节点</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'sidebar',
    data () {
      return {
        title: 'sidebar',
        isCollapse: false
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style>
  @import "../assets/css/sidebar.css";
</style>
