<template>
  <div class="login" v-title :data-title="`${title}登录`">
    <div class="login-bg">
      <img src="../assets/login.jpg" />
    </div>
    <div class="login-title">
      <h1>登录</h1>
    </div>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item class="form-input" ref="email" prop="email">
        <a-input v-model="form.email" placeholder="请输入邮箱地址"/>
      </a-form-model-item>
      <a-form-model-item class="form-input" ref="password" prop="password">
        <a-input v-model="form.password" type="password" placeholder="请输入密码"/>
      </a-form-model-item>
      <div class="login-btn">
        <a-button size="large" type="primary" @click="loginClick('form')">登录</a-button>
        <a-button size="large" @click="loginRouter('Register')">前往注册</a-button>
      </div>
    </a-form-model>
    <a-button type="link" class="home-btn" @click="loginRouter('Home')">先去逛逛</a-button>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { login } from "@/api/user";
import config from "@/config.js";
export default {
  data() {
    return {
      title: config.title,
      form: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    loginClick(loginForm) {
      this.$refs[loginForm].validate((valid) => {
        if (valid) {
          login(this.form).then((res) => {
            if(res.data.code === 2000){
              //保存token和用户信息
              Cookies.set('token',res.data.data.token,{ expires: 7 });
              Cookies.set('userInfo',JSON.stringify(res.data.data.user),{ expires: 7 });
              this.$router.push({ name: "Home" });
            }else{
              this.$message.error(res.data.msg);
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    loginRouter(name) {
      this.$router.push({ name: name });
    },
  },
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.login-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: -1;
}

.login-bg > img {
  width: 100%;
  height: 100%;
}

.login-title {
  width: 100%;
  margin: 25% 5% 20px;
  color: #fff;
}

.login-title > h1{
  color: #fff;
}

.form-input{
  margin: 10px 10px;
}

.home-btn{
  float:right;
  color: #fff;
  font-size: 16px;
  margin-top: 10px;
}

.login-btn{
  text-align: center;
}

.login-btn>button{
  height: 36px;
  width: calc(100% - 20px);
  margin-bottom: 10px;
}

</style>