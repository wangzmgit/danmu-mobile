<template>
  <div class="card-list">
    <div class="v-card" v-for="(item, index) in videoList" :key="index">
      <div class="card" @click="video(item.vid)">
        <img :src="item.cover" />
        <div class="title">
          <p>{{ item.title }}</p>
        </div>
      </div>
    </div>
    <div v-if="more" class="more">
      <a-spin v-if="loadingMore" />
      <a-button v-else @click="getMore()">加载更多...</a-button>
    </div>
  </div>
</template>

<script>
import { getVideoList } from "@/api/video";
export default {
  props: {},
  data() {
    return {
      videoList: [],
      page: 1,
      flag: true, //视频在第一页
      loadingMore:false,
      more:true,//允许加载更多
    };
  },
  methods: {
    _getVideoList() {
      getVideoList(this.page, 6).then((res) => {
        if (res.data.code === 2000) {
          if (this.flag) {
            this.videoList = res.data.data.videos;
            this.flag = false;
          } else {
            var newList = res.data.data.videos;
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
    //页面跳转
    video(vid) {
      this.$router.push({ name: "Video", params: { vid: vid } });
    },
    getMore() {
      this.loadingMore = true;
      this.page++;
      this._getVideoList();
    },
  },
  created() {
    this._getVideoList();
  },
};
</script>

<style scoped>
.card-list {
  margin: 0 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.v-card {
  width: 48%;
  height: 150px;
  margin-left: 1%;
}

.card {
  position: relative;
  overflow: hidden;
  border-radius: 2px;
}

.card > img {
  top: 0;
  left: 0;
  width: 100%;
  height: 130px;
}

.title {
  position: absolute;
  bottom: 0;
  height: 30px;
  width: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), transparent);
}

.title > p {
  font-size: 14px;
  color: #fff;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.more{
  width: 100%;
  text-align: center;
}
</style>