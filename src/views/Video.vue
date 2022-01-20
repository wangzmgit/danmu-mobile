<template>
  <div class="video-page" v-title :data-title="`${title}-视频播放`">
    <a-affix>
     <header-bar class="header"></header-bar>
    <div class="video-player">
      <w-player :key="timer" v-if="showPlayer" :vid="vid" :options="options" />
    </div>
    </a-affix>
    <div v-if="reply" class="reply">
      <!--回复详情-->
      <div class="reply-title">
        <p>回复详情</p>
        <p @click="reply=false,busy=false"><a-icon type="close" /></p>
      </div>
      <div class="reply-list">
        <reply-list :replyList="list"></reply-list>
      </div>
    </div>
    <div v-else class="comment" v-infinite-scroll="getMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <div v-if="showInfo" class="info">
        <div class="video-title">
          <span :class="['title',fold?'title-fold':'']">{{ videoInfo.title }}</span>
          <div class="fold" @click="fold = !fold">
            <a-icon v-if="fold" type="caret-down" />
            <a-icon v-else type="caret-up" />
          </div>
        </div>
        <div v-if="fold" class="author-fold">
          <a-avatar v-if="videoInfo.author.avatar" :size="20" :src="videoInfo.author.avatar"/>
          <a-avatar v-else :size="20" icon="user" />
          <span>&nbsp;&nbsp;{{videoInfo.author.name}}&nbsp;{{videoInfo.create_at | toTime}}</span>
        </div>
        <div v-else>
          <div class="author info-item">
            <a-avatar v-if="videoInfo.author.avatar" :size="50" :src="videoInfo.author.avatar"/>
            <a-avatar v-else :size="50" icon="user" />
            <p class="name">{{videoInfo.author.name}}</p>
            <p class="date">发布于&nbsp;{{videoInfo.create_at | toTime}}</p>
          </div> 
          <p v-show="videoInfo.copyright" class="info-item"><a-icon style="color:#fd6d6f" type="stop" />未经作者授权，禁止转载</p>
          <p class="info-item">{{videoInfo.desc}}</p>
          <!-- 视频分集 -->
          <div class="resource" v-if="length > 1">
            <div class="resource-item" v-for="(item, index) in videoInfo.resource" :key="index">
              <div @click="changeResource(index)">
                <span>{{ index + 1}}P</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <comment-list ref="comment" :vid="vid"></comment-list>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import WPlayer from "@/components/WPlayer/WPlayer.vue";
import { toRelativeTime } from "@/utils/time";
import HeaderBar from "@/components/HeaderBar.vue";
import { getVideoInfo } from "@/api/video";
import { getReplyList } from "@/api/comment"
import Comment from "@/components/CommentList";
import ReplyList from '../components/ReplyList.vue';
export default {
  data() {
    return {
      timer: "",//刷新播放器
      length: 0,//分集长度
      title:config.title,
      vid: 0,
      hls:null,
      videoInfo: [],
      url: "",
      fold: true,//是否折叠
      showPlayer: false,
      showInfo: false,
      busy:false,//不允许加载更多
      reply:false,//显示回复
      list:[],//回复列表
      options: {
        type: 'mp4',
        resource: {}
      }
    };
  },
  methods: {
    init() {
      getVideoInfo(this.vid).then((res) => {
        if (res.data.code === 2000) {
          let tempData = res.data.data;
          this.videoInfo = tempData.video;
          // this.authorID = tempData.video.author.uid;
          // this.interactive = tempData.interactive;
          this.options.type = tempData.video.video_type;
          this.options.resource = tempData.video.resource[0];
          this.length = tempData.video.resource.length;
          this.showInfo = true;
          this.showPlayer=true;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //改变分集
    changeResource(index) {
      this.options.resource = this.videoInfo.resource[index];
      this.timer = new Date().getTime();
    },
    getMore(){
      this.$refs.comment.getMore();
    },
    noMore(){
      this.busy = true;
    },
    //回复列表
    showReplyList(cid){
      getReplyList(cid).then((res)=>{
        if(res.data.code === 2000){
          this.list = res.data.data.replies;
          this.reply = true;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    }
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
    "reply-list":ReplyList,
  },
  filters: {
    toTime(time) {
      return toRelativeTime(time);
    },
  },
};
</script>

<style scoped>
.video-page{
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

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

/**回复列表 */
.reply{
  width: 100%;
  flex: 1;
  overflow-y: hidden;
}

.reply-list{
  height: calc(100% - 30px);
  overflow: scroll;
}

.reply-title{
  height: 30px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reply-title>p{
  margin: 0;
}

/**评论 */
.comment{
  height: 100%;
  overflow-y:scroll;
}

/**分集 */
.resource {
  display: flex;
  flex-wrap: wrap;
}

.resource-item {
  width: 20%;
  height: 30px;
}

.resource-item > div {
  width: 90%;
  height: 96%;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background-color: #e9e9e9;
}

</style>