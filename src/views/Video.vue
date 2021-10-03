<template>
  <div v-title :data-title="`${title}-视频播放`">
    <header-bar></header-bar>
    <div class="video-player">
      <w-player v-if="showPlayer" :src="videoInfo.video" :vid="vid" :type="videoInfo.video_type"></w-player>
    </div>
    <div class="info">
      <div class="video-title">
        <span :class="['title',fold?'title-fold':'']">{{ videoInfo.title }}</span>
        <div class="fold" @click="fold = !fold">
          <a-icon v-if="fold" type="caret-down" />
          <a-icon v-else type="caret-up" />
        </div>
      </div>
      <div v-if="fold" class="author-fold">
        <a-avatar :size="20" :src="authorInfo.avatar" />
        <span>&nbsp;&nbsp;{{authorInfo.name}}&nbsp;{{videoInfo.create_at | toTime}}</span>
      </div>
      <div v-else>
        <div class="author info-item">
          <a-avatar :size="50" :src="authorInfo.avatar" />
          <p class="name">{{authorInfo.name}}</p>
          <p class="date">发布于&nbsp;{{videoInfo.create_at | toTime}}</p>
        </div> 
        <p v-show="videoInfo.original" class="info-item"><a-icon style="color:#fd6d6f" type="stop" />未经作者授权，禁止转载</p>
        <p class="info-item">{{videoInfo.introduction}}</p>
        </div>
      </div>
    <comment-list :vid="vid"></comment-list>
  </div>
</template>

<script>
import config from "@/utils/config.js";
import WPlayer from "@/components/WPlayer/WPlayer.vue";
import { toRelativeTime } from "@/utils/time";
import HeaderBar from "@/components/HeaderBar.vue";
import { getVideoInfo } from "@/api/video";
import Comment from "@/components/CommentList";
export default {
  data() {
    return {
      title:config.title,
      vid: 0,
      hls:null,
      videoInfo: [],
      authorInfo: [],
      url: "",
      fold:true,//是否折叠
      showPlayer:false,
    };
  },
  methods: {
    init() {
      getVideoInfo(this.vid).then((res) => {
        if (res.data.code === 2000) {
          this.videoInfo = res.data.data.video;
          this.authorInfo = res.data.data.video.author;
          this.url = this.videoInfo.video;
          this.showPlayer=true;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
  },
  beforeDestroy() {
    if(this.hls!=null){
      this.hls.stopLoad();
      this.hls.destroy();
    }
  },
  created() {
    this.vid = Number(this.$route.params.vid);
    this.init();
  },
  components: {
    "header-bar": HeaderBar,
    "comment-list": Comment,
    "w-player": WPlayer,
  },
  filters: {
    toTime(time) {
      return toRelativeTime(time);
    },
  },
};
</script>

<style scoped>
.video-player{
  width: 100%;
  height: auto;
}

.player{
  width: 100%;
  height: 100%;
}

.info{
  padding: 0 2px;
  margin-top: 6px;
  border-bottom: 1px solid #e7e7e7;
}

.video-title{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.title{
  color: #333;
  line-height: 22px;
  font-weight: 700;
  font-size: 20px;
  margin-left: 6px;
}

.title-fold{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.fold{
  width: 40px;
  text-align: center;
}

/**折叠状态 */
.author-fold{
  display: flex;
}

/**展开 */
.info-item{
  color: #999;
  margin: 4px 0 2px 6px;
}

.author{
  position: relative;
}

.name{
  position: absolute;
  color: #383838;
  top: 4px;
  left: 56px;
}

.date{
  position: absolute;
  top:26px;
  left: 56px;
}
</style>