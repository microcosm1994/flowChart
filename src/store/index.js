import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    User: {}, // 用户信息
    diagram: null, // 流程图实例对象
    sourceCode: null, // 流程图json数据（源码）
    modal: { // 弹框
      title: '',
      name: '',
      switch: false
    },
    compute: {}, // 计算
    currentnNode: {} // 新添
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
    /* 流程图json数据（源码） */
    sourceCode (state, json) {
      state.sourceCode = json
    },
    /* 弹框 */
    modal (state, obj) {
      state.modal.title = obj.title
      state.modal.name = obj.name
      state.modal.switch = obj.switch
    },
    /* 计算 */
    compute (state, obj) {
      state.compute = obj
    },
    /* 当前节点信息 */
    currentnNode (state, obj) {
      state.currentnNode = obj
    },
  }
})
