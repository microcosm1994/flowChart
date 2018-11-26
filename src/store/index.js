import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    User: {}, // 用户信息
    diagram: null, // 流程图实例对象
    echarts: {}, // echarts图标对象集
    refs: {}, // dom树
    sourceCode: null, // 流程图json数据（源码）
    colors: {}, // 节点颜色
    modalData: {}, // 弹框数据
    modal: { // 弹框开启/关闭
      switch: false
    },
    modalInfo: {}, // 弹框信息
    currentnNode: {}, // 新添
    userConfig: {},// 用户配置
    scale: null, // 缩放
    getData: {}, // 弹框数据
    recycleData: {}, // 回收站数据
    recycleModal: false, // 回收站弹框
    pagination: true, // 分页
    recyclePagination: true, // 回收站分页
  },
  mutations: {
    /* 用户信息 */
    User (state, obj) {
      state.User = obj
    },
    /* 流程图实例对象 */
    diagram (state, obj) {
      state.diagram = obj
    },
    /* echarts对象集 */
    echarts (state, obj) {
      for (let key in obj) {
        state.echarts[key] = obj[key]
      }
    },
    /* dom树 */
    refs (state, obj) {
      state.refs = obj
    },
    /* 弹框数据 */
    modalData (state, obj) {
      state.modalData = obj
    },
    /* 弹框开启/关闭 */
    modal (state, boolean) {
      state.modal.switch = boolean
    },
    /* 弹框信息 */
    modalInfo (state, obj) {
      state.modalInfo = obj
    },
    /* 报告总数 */
    reportCount (state, obj) {
      state.reportCount = obj
    },
    /* 报告总数按日期 */
    reportCountByDay (state, obj) {
      state.reportCountByDay = obj
    },
    /* 报告类别 */
    reportType (state, number) {
      state.reportType = number
    },
    /* 生成报告数据 */
    reportData (state, obj) {
      state.reportData = obj
    },
    /* 流程图json数据（源码） */
    sourceCode (state, json) {
      state.sourceCode = json
    },
    /* 节点颜色 */
    colors (state, obj) {
      let colors = obj
      for (let key in colors) {
        colors[Math.round(key - 0)] = colors[key][0]
        delete colors[key]
      }
      state.colors = colors
    },
    /* 当前节点信息 */
    currentnNode (state, obj) {
      state.currentnNode = obj
    },
    /* 用户配置 */
    userConfig (state, obj) {
      state.userConfig = obj
    },
    /* 缩放 */
    scale (state,obj){
      state.scale = obj
    },
    /* 页面数据 */
    getData (state, obj) {
      state.getData = obj
    },
    /* 回收站数据 */
    recycleData (state, obj) {
      state.recycleData = obj
    },
    /* 回收站弹框 */
    recycleModal (state, boolean) {
      state.recycleModal = boolean
    },
    /* 分页 */
    pagination (state, boolean) {
      state.pagination = boolean
    },
    /* 回收站分页 */
    recyclePagination (state, boolean) {
      state.recyclePagination = boolean
    }
  },
})
