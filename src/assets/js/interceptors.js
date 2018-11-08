import axios from 'axios'
import cookies from 'vue-cookies'
import router from '../../router'
export const $axios = axios.create()

// 拦截请求
$axios.interceptors.request.use(
  config => {
    // 获取存在cookie中的token
    let t = cookies.get('t')
    // 如果是登录的接口就跳过
    if (config.url === '/api/user/login') {
      return config
    }
    // 如果是其他接口就在请求的header中加一个token
    if (t) {
      config.headers.t = t
      return config
    } else {
      // 如果没有token则返回重新登陆
      router.push({path: '/'})
    }
  },
  err => {
    return Promise.reject(err)
  }
)

// 拦截响应
$axios.interceptors.response.use(
  response => {
    // 拦截状态码
    switch (response.status) {
      case 400:
        // 这里写清除token的代码
        cookies.remove('t')
        cookies.remove('u')
        cookies.remove('p')
        router.replace({
          path: '/',
          query: {redirect: router.currentRoute.fullPath} // 登录成功后跳入浏览的当前页面
        })
    }
    return response
  },
  err => {
    if (err.response) {}
    return Promise.reject(err)
  }
)
