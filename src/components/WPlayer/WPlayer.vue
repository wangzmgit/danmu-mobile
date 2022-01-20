<template>
  <div ref="videoOuterLayer" class="uncheck" @click="ClickVideo()">
    <div :class="full?'video-box-full':'video-box'" ref="videoBox">
      <!--弹幕层-->
      <danmaku v-if="showDanmaku" :danmakuList="danmakuList" ref="danmaku"></danmaku>
      <!--Video层-->
      <video
        ref="video"
        class="player"
        preload="auto"
        @canplay="VideoInit()"
        @timeupdate="TimeUpdate()"
        @ended="VideoEnd()"
      />
      <!--消息层-->
      <div>
        <span v-if="message" class="msg">{{msg}}</span>
      </div>
      <!--控制栏层-->
      <div class="control" v-show="control">
        <control ref="control"></control>
      </div>
    </div>
    <!--发送弹幕组件-->
    <send-danmaku v-if="false"></send-danmaku>
  </div>
</template>

<script>
import Hls from "hls.js";
import { SendDanmakuAPI,GetDanmakuAPI } from "./js/api.js"
import Control from "./components/control.vue";
import Danmaku from "./components/danmaku.vue";
import SendDanmaku from "./components/send-danmaku.vue";
export default {
  props: {
    vid: {
      type: Number,
      default: null,
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      hls: null,
      msg: "",//消息内容
      amount:0,//弹幕数量
      message: false,  
      control:true,
      showDanmaku: true,  
      showVideoInfo:false,
      currentTime:0,
      danmakuList: [],
      full: false,//是否全屏
      original: false,//是否为原始分辨率
      defaultRes: 720,//默认分辨率(之后可调整)
      maxRes: 1080,//最大分辨率
      currentRes: 720,//当前分辨率
    };
  },
  computed: {
    //参数
    params() {
      return Object.assign({
        type: 'mp4',
        resource: {}
      },this.options)
    },
  },
  methods: {
    VideoInit() {
      let video = this.$refs.video;
      this.$refs.control.Init(video.duration);
    },
    //更新进度时间
    TimeUpdate() {
      let video = this.$refs.video;
      if(video == undefined){
        return;
      }
      this.currentTime = video.currentTime;
      let loaded = 0;
      if (video.buffered.length) {
        loaded = video.buffered.end(video.buffered.length - 1)
      }
      this.$refs.control.TimeUpdate(
        video.currentTime,
        loaded
      );
      if(this.$refs.danmaku){
        this.$refs.danmaku.TimeUpdate(video.currentTime);
      }
    },
    VideoEnd() {
      this.$refs.control.VideoEnd();
    },
    ChangeVideoProgress(currTime) {
      this.$refs.video.currentTime = currTime;
    },
    //显示消息
    ShowMessage(msg) {
      this.msg = msg;
      this.message = true;
      //定时隐藏
      setTimeout(() => {
        this.message = false;
      }, 3000);
    },
    //清除弹幕
    ClearDanmaku() {
      this.$refs.danmaku.ClearDanmaku();
    },
    //暂停弹幕
    PauseDanmaku() {
      if(this.$refs.danmaku){
        this.$refs.danmaku.Pause();
      }
    },
    //开始弹幕
    StartDanmaku() {
      if(this.$refs.danmaku){
        this.$refs.danmaku.Start();
      }
    },
    //发送弹幕
    Send({text, color, type}){
      let vid = Number(this.vid);
      let time = Math.round(this.currentTime);
      SendDanmakuAPI(vid,time,color,type,text).then((res)=>{
        if(res.data.code === 2000){
          //绘制弹幕
          this.Draw({text, color, type});
          this.ShowMessage("发送成功");
        }
      }).catch((err) => {
        this.ShowMessage(err.response.data.msg);
      });
    },
    //绘制弹幕
    Draw({text, color, type}){
      this.$refs.danmaku.DrawDanmaku({text, color, type},true);
    },
    //设置弹幕不透明度
    SetOpaque(opacity){
      this.$refs.danmaku.SetOpaque(opacity);
    },
    //开启或关闭弹幕
    ShowDanmaku(val){
      this.showDanmaku = val;
    },
    //隐藏控制栏
    HideControl(){
      setTimeout(() => {
        this.$refs.control.ShowMenu("");
        this.control = false;
      }, 3000);
    },
    ClickVideo() {
      if (!this.control) {
        this.control = true;
        if (!this.$refs.video.paused) {
          setTimeout(() => {
            this.$refs.control.ShowMenu("");
            this.control = false;
          }, 3000);
        }
      }
    },
    GetDanmaku(){
      GetDanmakuAPI(this.vid).then((res) => {
        if (res.data.code === 2000) {
          this.danmakuList = res.data.data.danmaku;
          this.amount = this.danmakuList.length;
        }
      });
    },
    //处理全屏
    Full(full){
      this.full = full;
    },
    //获取最大分辨率
    getMaxRes() {
      let resource = this.params.resource;
      if (resource.res1080) return 1080;
      if (resource.res720) return 720;
      if (resource.res480) return 480;
      if (resource.res360) return 360;
    },
    //获取默认的分辨率
    getDefaultRes(res) {
      this.maxRes = this.getMaxRes();
      this.currentRes = (this.maxRes >= res ? res : this.maxRes);
      return 'res' + this.currentRes;
    },
    //设置分辨率
    SetRes(res) {
      if (this.original) return;
      if (this.currentRes === res) return; 
      this.currentRes = res;
      if (this.params.type == "hls") {
        
        this.LoadHls(this.params.resource['res' + res]);
      } else {
        if (this.original) {
          this.$refs.video.src = this.params.resource.original;
        } else {
          let res = this.getDefaultRes(this.defaultRes);
          this.$refs.video.src = this.params.resource[res]
        }
      }
    },
    LoadHls(src) {
      if(this.hls != null){
        this.hls.stopLoad();
        this.hls.destroy();
      }
      this.hls = new Hls();
      this.hls.loadSource(src);
      this.hls.attachMedia(this.$refs.video);
      this.hls.on(Hls.Events.ERROR, () => {
        console.log('加载失败');
      });
    }
  },
  mounted(){
    if (this.params.resource.original) this.original = true;
    if(this.params.type == "hls"){
      if (this.original) {
        this.LoadHls(this.params.resource.original);
      } else {
        let res = this.getDefaultRes(this.defaultRes);
        this.LoadHls(this.params.resource[res]);
      }
    } else {
      if (this.original) {
        this.$refs.video.src = this.params.resource.original;
      } else {
        let res = this.getDefaultRes(this.defaultRes);
        this.$refs.video.src = this.params.resource[res]
      }
    }
  },
  created(){
    this.GetDanmaku();
  },
  beforeDestroy() {
    if(this.hls!=null){
      this.hls.stopLoad();
      this.hls.destroy();
    }
  },
  components: {
    control: Control,
    danmaku: Danmaku,
    "send-danmaku": SendDanmaku,
  },
};
</script>

<style scoped>
.uncheck {
  /**禁止文字选中 */
  -moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.video-box {
  height: 0;
  width: 100%;
  position: relative;
  padding-bottom: 56.25%;
}

.video-box-full {
  width: 100%;
  position: relative;
}

.player {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: black;
}

.control {
  z-index: 20;
  position: absolute;
  width: 100%;
  height: 50px;
  background: linear-gradient(rgba(0, 0, 0, 0), #000);
  bottom: 0;
  transition: opacity 1s;
  -moz-transition: opacity 1s; /* Firefox 4 */
  -webkit-transition: opacity 1s; /* Safari 和 Chrome */
  -o-transition: opacity 1s; /* Opera */
}

.msg {
  z-index: 10;
  position: absolute;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  width: 160px;
  height: 26px;
  left: 10px;
  bottom: 60px;
  line-height: 26px;
  border-radius: 2px;
  color: aliceblue;
}
</style>