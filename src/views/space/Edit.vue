<template>
  <div class="info" v-title data-title="编辑资料">
    <header-bar></header-bar>
    <table class="info-card">
      <tr>
        <td>头像</td>
        <td>
          <a-avatar v-if="userInfo.avatar" :size="50" :src="userInfo.avatar" />
          <a-avatar v-else :size="80" icon="user" />
        </td>
      </tr>
      <tr>
        <td>昵称</td>
        <td>{{ userInfo.name }}</td>
      </tr>
      <tr>
        <td>UID</td>
        <td>{{ userInfo.uid }}</td>
      </tr>
      <tr>
        <td>性别</td>
        <td>{{ userInfo.gender | toGender }}</td>
      </tr>
      <tr>
        <td>出生日期</td>
        <td>{{ userInfo.birthday | date }}</td>
      </tr>
      <tr>
        <td>个性签名</td>
        <td>{{ userInfo.sign }}</td>
      </tr>
    </table>
    <div class="btn-card">
      <div class="item" @click="logout()">退出登录</div>
      <div class="item" @click="goMine()">返回空间</div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { toDate } from "@/utils/time.js";
import HeaderBar from "@/components/HeaderBar.vue";
export default {
  data() {
    return {};
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
  methods: {
    goMine() {
      this.$router.push({ name: "Space" });
    },
    logout() {
      //清除token和用户信息并刷新页面
      Cookies.remove("token");
      Cookies.remove("userInfo");
      this.$router.go(0);
    },
  },
  components: {
    "header-bar": HeaderBar,
  },
  filters: {
    toGender(gender) {
      if (gender == 1) return "男";
      else if (gender == 2) return "女";
      else return "未知";
    },
    date(time) {
      return toDate(time);
    },
  },
};
</script>

<style scoped>
.info {
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  position: fixed;
  background: #f4f4f4;
}

.info-card {
  margin-top: 12px;
  width: 100%;
  background: #fff;
  border-collapse: collapse;
  font-size: 14px;
}

.info-card > tr {
  border-bottom: 1px solid #eee;
}

.info-card > tr > td {
  padding: 10px 0;
}

.info-card > tr > td:nth-child(1) {
  padding-left: 12px;
  text-align: left;
  color: #505050;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.info-card > tr > td:nth-child(2) {
  padding-right: 12px;
  text-align: right;
  color: #999;
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-card {
  margin-top: 20px;
}

.item:first-child {
  border-bottom: 1px solid #eee;
}

.item {
  display: block;
  padding: 10px;
  text-align: center;
  color: #505050;
  text-decoration: none;
  background: #fff;
  font-size: 14px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>