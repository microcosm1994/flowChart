<template>
  <div class="login-box">
    <!--<h1>监测系统</h1>-->
    <div class="login-title">MGZ 监测系统</div>
    <div class="login">
      <div class="login-header">
        登 录
      </div>
      <div class="login-form">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm" size="small">
          <el-form-item label="账号" prop="username">
            <el-input type="text" v-model="ruleForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" auto-complete="off" @keyup.native.13="submitForm('ruleForm')"></el-input>
          </el-form-item>
          <div class="rember">
            <el-checkbox v-model="checked">记住账号</el-checkbox>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    let validateusername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    let validatepassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      checked: false,
      Socket: null,
      ruleForm: {
        username: 'admin',
        password: '0123456789'
      },
      rules: {
        username: [
          { validator: validateusername, trigger: 'blur' }
        ],
        password: [
          { validator: validatepassword, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    let u = this.$cookies.get('u')
    let p = this.$cookies.get('p')
    if (u && p) {
      this.ruleForm.username = u
      this.ruleForm.password = p
      this.checked = true
    }
  },
  methods: {
    submitForm (formName) {
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let user = {}
          user.u = this.ruleForm.username
          user.p = this.ruleForm.password
          this.$http.post('/api/user/login', user).then((response) => {
            // 判断返回状态
            if (response.status === 200) {
              // 保存用户信息
              self.$store.commit('User', response.data.u)
              // 记住账号
              if (self.checked) {
                self.$cookies.set('u', self.ruleForm.username, 60 * 60 * 24 * 90, {
                  domain: 'localhost',
                  path: '/'
                })
                self.$cookies.set('p', self.ruleForm.password, 60 * 60 * 24 * 90, {
                  domain: 'localhost',
                  path: '/'
                })
              } else {
                // 清楚cookies
                self.$cookies.remove('u')
                self.$cookies.remove('p')
              }
              // 保存用户名
              self.$cookies.set('uname', response.data.u.loginName, {
                domain: 'localhost',
                path: '/'
              })
              // 保存token
              self.$cookies.set('t', response.data.t, {
                domain: 'localhost',
                path: '/'
              })
              // 获取历史记录
              let redirect = this.$route.query.redirect
              if (redirect) {
                self.$router.push({path: redirect})
              } else {
                self.$router.push({path: '/'})
              }
            } else {
              console.log('用户名密码错误')
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
  @import "../assets/css/login.css";
</style>
