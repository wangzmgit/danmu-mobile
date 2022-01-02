<template>
  <div class="login" v-title :data-title="`${title}注册`">
    <div class="login-bg">
      <img src="../assets/login.jpg" />
    </div>
    <div class="login-title">
      <h1>注册</h1>
    </div>
        <a-form-model ref="register" :model="registerFrom" :rules="rules">
          <a-form-model-item class="form-input" ref="name">
            <a-input v-model="registerFrom.name" placeholder="昵称(非必填)"/>
          </a-form-model-item>  
          <a-form-model-item class="form-input" ref="email" prop="email">
            <a-input v-model="registerFrom.email" placeholder="常用邮箱"/>
          </a-form-model-item>
          <a-form-model-item class="form-input" ref="password" prop="password">
            <a-input v-model="registerFrom.password" type="password" placeholder="密码(6位以上字符)"/>
          </a-form-model-item>
          <a-form-model-item class="code-box" ref="code" prop="code">
            <a-input class="code-input" v-model="registerFrom.code" placeholder="邮箱验证码"/>
            <a-button :disabled="disabled" type="primary" @click="sendCode()">{{text}}</a-button>
          </a-form-model-item>
          <div class="login-btn">
            <a-button size="large" type="primary" @click="registerClick('register')">确认注册</a-button>
          </div>
        </a-form-model>
  </div>
</template>

<script>
import { send } from "@/api/code.js";
import { register } from "@/api/user";
import config from "@/config.js";
export default {
  data() {
    return {
      title: config.title,
      disabled:false,//禁用发送按钮
      text:"发送验证码",
      registerFrom: {
        email: "",
        password: "",
        code:"",
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  methods: {
    sendCode(){
      //禁用发送按钮
      this.disabled = true;
      send(this.registerFrom.email).then((res)=>{
        if(res.data.code === 2000){
          this.$message.success("发送成功");
          //开启倒计时
          let count = 0;
          let tag = setInterval(() => {
            if (++count >= 60) {
              clearInterval(tag);
              this.disabled = false;
              this.text = "发送验证码";
              return;
            }
            this.text = `${60 - count}秒后获取`;
          }, 1000);
        }
      }).catch(() => {
        this.disabled = false;
        this.text = "发送验证码";
        this.$message.error("发送失败");
      });
    },
    registerClick(loginForm) {
      this.$refs[loginForm].validate((valid) => {
        if (valid) {
          register(this.registerFrom).then((res) => {
            if(res.data.code === 2000){
              this.$message.success("注册成功");
              this.$router.push({ name: "Login" });
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

.code-box{
  margin: 10px 10px;
}

.code-input{
  width: calc(100% - 126px);
  margin-right: 20px;
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