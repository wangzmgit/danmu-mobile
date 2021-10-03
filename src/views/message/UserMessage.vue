<template>
  <div class="u-msg" v-title data-title="私信">
    <a-affix>
      <div class="u-msg-top">
        <span @click="back()"><a-icon type="left" /></span>
        <p>{{ user.name }}</p>
        <span></span>
      </div>
    </a-affix>
    <!--内容-->
    <div class="u-msg-main">
      <MessageList :list="msgDetails"></MessageList>
    </div>
    <!--发送-->
    <footer id="input" class="send">
      <input v-model="msg.content" placeholder="发个消息聊聊呗~" />
      <a-button :disabled="disabled" @click="Send()">发送</a-button>
    </footer>
  </div>
</template>

<script>
import MessageList from "../../components/MessageList.vue"
import Cookies from "js-cookie";
import { getMsgDetails, sendMsg } from "@/api/message";
export default {
  data() {
    return {
      user: {
        avatar: "",
        name: "",
      },
      msgDetails: [],
      msg: {
        fid: 0,
        content: "",
      },
      disabled:false,//禁用发送按钮
    };
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
    GetMsgDetails(fid) {
      getMsgDetails(fid).then((res) => {
        if (res.data.code === 2000) {
          this.user.avatar = res.data.data.avatar;
          this.user.name = res.data.data.name;
          this.msgDetails = res.data.data.messages;
          this.msg.fid = fid;
        }
      });
    },
    back() {
      this.$router.push({ name: "Message" });
    },
    Send(){
      this.disabled = true;
      sendMsg(this.msg).then((res) => {
        if (res.data.code === 2000) { 
          this.msgDetails.push({from_id:this.userInfo.uid,content:this.msg.content});
          this.msg.content = "";
          this.$message.success("发送成功");
          this.disabled = false;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
        this.disabled = false;
      });
    }
  },
  created() {
    if (this.$route.params.fid) {
      let fid = Number(this.$route.params.fid);
      this.msg.fid = fid;
      this.GetMsgDetails(fid);
    }
  },
  components:{
    MessageList
  }
};
</script>

<style scoped>

.u-msg {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #f4f4f4;
}

.u-msg-top {
  height: 50px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.u-msg-top > span {
  width: 50px;
  text-align: center;
}

.u-msg-top > p {
  margin: 0;
  font-size: 1rem;
}

.u-msg-main{
  height: calc(100% - 80px);
}

.send {
  height: 30px;
  padding-top: 2px;
  background: #fff;
}

.send > input {
  height: 26px;
  margin-left: 10px;
  width: calc(100% - 90px);
  border: 0;
  outline: none;
  padding: 0 2px;
  border-radius: 6px;
  background: #ebebeb;
}

.send > button {
  height: 26px;
  margin-left: 10px;
}
</style>