import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    User: {}, // 用户信息
  },
  mutations: {
    User (state, obj) {
      state.User = obj
    },
  }
})
