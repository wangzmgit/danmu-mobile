<template>
  <div class="msg">
    <a-affix>
      <header-bar></header-bar>
      <div>
        <div class="announce-box" @click="goAnnounce()">
          <img src="../../assets/announce.png" />
          <span class="announce-name">系统公告</span>
        </div>
      </div>
    </a-affix>
    <!--list-->
    <div v-for="(item, index) in msgList" :key="index">
      <!--item-->
      <div class="msg-user-item" @click="goMsgDetails(item.uid)">
        <a-avatar class="msg-avatar" v-if="item.avatar" :size="45" :src="item.avatar"/>
        <a-avatar class="msg-avatar" v-else :size="45" icon="user" />
        <span class="msg-name">{{ item.name }}</span>
        <span class="msg-date">{{ item.created_at | toTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getMsgList } from "@/api/message";
import { toRelativeTime } from "@/utils/time";
import HeaderBar from "@/components/HeaderBar.vue";
export default {
  data() {
    return {
      msgList: [],
    };
  },
  methods: {
    _getMsgList() {
      getMsgList().then((res) => {
        if (res.data.code === 2000) {
          this.msgList = res.data.data.messages;
        }
      });
    },
    goAnnounce(){
      this.$router.push({ name: "Announce" });
    },
    //前往私信
    goMsgDetails(uid){
      this.$router.push({ name: "UserMsg", params: { fid: uid } });
    }
  },
  created() {
    this._getMsgList();
  },
  components: {
    "header-bar": HeaderBar,
  },
  filters: {
    toTime(time) {
      return toRelativeTime(time);
    },
  },
};
</script>

<style scoped>
.msg {
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  position: fixed;
  background: #f4f4f4;
  overflow-y: auto;
}

.announce-box {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.announce-box > img {
  width: 45px;
  height: 45px;
  margin: 8px 0 0 6px;
}

.announce-name {
  margin-left: 10px;
  font-size: 16px;
}

.msg-user-item {
  width: 100%;
  height: 60px;
  background-color: #fff;
  position: relative;
  border-bottom: 1px solid #e0e0e0;
}

.msg-avatar {
  margin: 8px 0 0 6px;
}

.msg-name {
  position: absolute;
  top: 8px;
  left: 60px;
  font-size: 16px;
}

.msg-date {
  position: absolute;
  top: 28px;
  left: 60px;
  color: #808080;
}
</style>