// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import element from 'element-ui'
import {$axios} from './assets/js/interceptors'
import store from '@/store/index'
import diagrams from './assets/js/faultTree/diagram'
import control from './assets/js/faultTree/control'
import jsoneditor from 'jsoneditor'
import html2canvas from 'html2canvas'
import 'element-ui/lib/theme-chalk/index.css'
import 'jsoneditor/dist/jsoneditor.min.css'
import './assets/css/public.css'
import './assets/css/icon/iconfont.css'

Vue.use(element)
Vue.prototype.$http = $axios;
Vue.prototype.$diagrams = diagrams;
Vue.prototype.$control = new control();
Vue.prototype.$jsoneditor = jsoneditor;
Vue.prototype.$html2canvas = html2canvas;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
