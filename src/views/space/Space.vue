<template>
  <div>
    <header-bar></header-bar>
    <div class="banner">
        <img src="../../assets/banner.jpg"/>
    </div>
    <div class="userdetail">
      <div class="user-info">
        <a-avatar v-if="userInfo.avatar" :size="80" :src="userInfo.avatar" />
        <a-avatar v-else :size="80" icon="user" />
        <div class="user-data">
          <div class="data-box">
            <p>
              <span>{{ count }}</span>
              <span class="data-text">投稿</span>
            </p>
            <p>
              <span>{{ followers }}</span>
              <span class="data-text">粉丝</span>
            </p>
            <p>
              <span>{{ following }}</span>
              <span class="data-text">关注</span>
            </p>
          </div>
          <div class="edit-box">
            <div class="edit-btn" @click="edit()">编辑资料</div>
          </div>
        </div>
      </div>
      <div>
        <h2 class="name">{{ userInfo.name }}</h2>
        <p class="sign">{{ userInfo.sign }}</p>
      </div>
      <div class="up">
        <p>我的上传</p>
      </div>
      <!--视频列表-->
      <my-video :list="videoList"></my-video>
      <div v-if="more" class="more">
        <a-spin v-if="loadingMore" />
        <a-button v-else @click="getMore()">加载更多...</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { getFollowData } from "@/api/follow";
import HeaderBar from "@/components/HeaderBar.vue";
import { getMyVideo } from "@/api/video";
import MyVideo from '../../components/MyVideo.vue';
export default {
  data() {
    return {
      following: 0,
      followers: 0,
      videoList: [],
      page: 1,
      count: 0,
      flag: true, //视频在第一页
      loadingMore:false,
      more:true,//允许加载更多
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
    _getFollowData() {
      getFollowData(this.userInfo.uid).then((res) => {
        this.following = res.data.data.following;
        this.followers = res.data.data.followers;
      });
    },
    _getMyVideo() {
      getMyVideo(this.page, 6).then((res) => {
        if (res.data.code === 2000) {
          if (this.count == 0) {
            //只有查询第一页时，会返回总数
            this.count = res.data.data.count;
          }
          if (this.flag) {
            this.videoList = res.data.data.data;
            this.flag = false;
          } else {
            var newList = res.data.data.data;
            if (newList.length == 0) {
              this.$message.info("没有更多了");
              this.more = false;
            } else {
              this.videoList = this.videoList.concat(newList);
            }
          }
          this.loadingMore = false;
        }
      });
    },
    getMore() {
      this.loadingMore = true;
      this.page++;
      this._getMyVideo();
    },
    edit() {
      this.$router.push({ name: "Edit" });
    },
  },
  components: {
    "header-bar": HeaderBar,
    "my-video": MyVideo,
  },
  created() {
    this._getFollowData();
    this._getMyVideo();
  },
};
</script>

<style scoped>
.banner{
  width: 100%;
  height: 100px;
}

.banner>img{
  width: 100%;
  height: 100%;
}

.userdetail {
  padding: 8px 12px;
  background-color: #fff;
}

.user-info {
  display: flex;
}

.user-data {
  flex: 1;
}

.data-box {
  display: flex;
}

.data-box > p {
  flex: 1;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 14px;
}

.data-text {
  color: #aaa;
}

.data-box > p:nth-child(1),
.data-box > p:nth-child(2) {
  border-right: 1px solid #ccc;
}

.edit-box {
  padding: 10px 2px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.edit-btn {
  width: 90%;
  height: 40%;
  padding: 3px;
  display: flex;
  margin-left: 5%;
  align-items: center;
  justify-content: center;
  color: #1890ff;
  border: 1px solid #1890ff;
  border-radius: 6px;
}

.name {
  margin: 10px 0 3px 0;
  font-weight: 400;
}
.sign {
  padding: 0;
  color: #999;
  margin-top: 10px;
}

.up{
  margin-bottom: 6px;
  border-top: 1px solid #e7e7e7;
  border-bottom: 1px solid #e7e7e7;
}

.up>p{
    font-size: 16px;
    margin: 6px 0;
}

.more{
  width: 100%;
  text-align: center;
}
</style>