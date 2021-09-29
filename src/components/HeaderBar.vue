<template>
  <div class="header">
    <div v-if="userInfo" class="header-user" @click="headerRouter('Space',$route.path)">
      <a-avatar v-if="userInfo.avatar" :size="36" :src="userInfo.avatar" />
      <a-avatar v-else :size="36" icon="user" />
    </div>
    <div v-else class="header-user">
      <a-avatar :size="40" @click="headerRouter('Login',$route.path)">登录</a-avatar>
    </div>
    <div class="search-box">
      <a-input-search v-model="keywords" v-show="this.$route.name != 'Search'" placeholder="搜索关键词~" @search="search()"/>
    </div>
    <div class="msg" @click="headerRouter('Message',$route.path)">
      <a-icon type="mail"/>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  data(){
    return{
      keywords:"",
    }
  },
  computed: {
    userInfo() {
      if (Cookies.get("userInfo")) {
        return JSON.parse(Cookies.get("userInfo"));
      } else {
        return null;
      }
    },
  },
  methods:{
    headerRouter(page,path){
      switch(page){
        case 'Space':
          if(path == "/space")
            page = "Home";
          break;
        case 'Message':
          if(path == "/message")
            page = "Home";
          break;
      }
      this.$router.push({ name: page });
    },
    logout() {
      //清除token和用户信息并刷新页面
      Cookies.remove('token');
      Cookies.remove('userInfo');
      this.$router.go(0);
    },
    search(){
      this.$router.push({ name: "Search", params: { keywords: this.keywords } });
    }
  }
};
</script>

<style scoped>
.header{
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #1890ff;
  -webkit-box-shadow:0px 0px 3px #c8c8c8 ;
  -moz-box-shadow:0px 0px 3px #c8c8c8 ;
  box-shadow:0px 0px 3px #c8c8c8 ;
}

.header-user {
  width: 70px;
  text-align: center;
}

.search-box {
  width: calc(100% - 130px);
}

.msg{
  width: 60px;
  color: #fff;
  font-size: 26px;
  text-align: center;
}

</style>