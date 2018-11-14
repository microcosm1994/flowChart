import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import login from '@/components/login'
import FTA from '@/components/FTA'
import healthy from '@/components/healthy'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          name: 'FTA',
          path: '/',
          component: FTA
        },
        {
          name: 'healthy',
          path: '/healthy',
          component: healthy
        }
      ]
    }
  ]
})
