<template>
  <div class="msg-list">
    <div v-for="(item, index) in list" :key="index" class="content-box">
      <!--自己发送的-->
      <div v-if="item.from_id == userInfo.uid">
        <a-avatar class="avatar-right" v-if="userInfo" :size="45" :src="userInfo.avatar"/>
        <a-avatar class="avatar-right" v-else :size="45" icon="user" />
        <span class="content-right">{{ item.content }}</span>
      </div>
      <!--收到的-->
      <div v-else>
        <a-avatar class="avatar-left" v-if="avatar" :size="45" :src="avatar" />
        <a-avatar class="avatar-left" v-else :size="45" icon="user" />
        <div class="content-left-box">
          <span class="content-left">{{ item.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  props: {
    list: {
      type: Array,
      default: null,
    },
    avatar: {
      type: String,
      default: "",
    },
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
    //页面跳转
    video(vid) {
      this.$router.push({ name: "Video", params: { vid: vid } });
    },
  },
};
</script>

<style scoped>
.msg-list {
  overflow-y: scroll;
  max-height: 100%;
}

.content-box {
  min-height: 70px;
  margin: 0 10px;
  overflow-y: scroll;
}
.content-box:nth-child(1) {
  margin-top: 10px;
}

.avatar-right {
  float: right;
}

.content-right {
  float: right;
  max-width: 80%;
  margin-right: 10px;
  margin-top: 6px;
  background: #1890ff;
  color: #fff;
  font-size: 16px;
  border-radius: 3px;
  padding: 5px 10px 5px 10px;
}

.avatar-left {
  float: left;
}

.content-left-box {
  float: left;
  margin-left: 10px;
  margin-top: 10px;
  max-width: 80%;
  background: #fff;
  padding: 5px 10px 5px 10px;
  border-radius: 3px;
}

.content-left {
  font-size: 1rem;
}
</style>