import axios from 'axios'
import cookies from 'vue-cookies'
import router from '../../router'
export const $axios = axios.create({
  timeout: 7000,
})

// 拦截请求
$axios.interceptors.request.use(
  config => {
    let t = cookies.get('t')
    if (config.url === '/api/user/login') {
      return config
    }
    if (t) {
      config.headers.t = t
      return config
    } else {
      router.push({path: '/login'})
    }
  },
  err => {
    return Promise.reject(err)
  }
)

// 拦截响应
$axios.interceptors.response.use(
  response => {
    switch (response.status) {
      case 304:
        console.log(304);
    }
    return response
  },
  err => {
    if (err.response) {
      switch (err.response.status) {
        case 401:
          // 这里写清除token的代码
          cookies.remove('t')
          router.push({path: '/login'})
        case 401:
          // 这里写清除token的代码
          console.log(err);
        case 404:
          console.log(2);
      }
    }
    return Promise.reject(err)
  }
)
