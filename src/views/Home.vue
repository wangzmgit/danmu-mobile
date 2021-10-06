<template>
  <div class="home" v-title :data-title="`${config.title}首页`" >
    <a-affix>
     <header-bar></header-bar>
    </a-affix>
    <div v-infinite-scroll="getMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <a-carousel :autoplay="true">
        <div v-for="(item, index) in carousel" :key="index">
          <img class="carousel-img" :src="item.img" />
        </div>
      </a-carousel>
      <div class="transition">
        <span>视频列表</span>
      </div>
      <!--视频列表-->
      <video-list :list="videoList"></video-list>
      <div v-show="loadingMore" class="more">
        <a-spin />
      </div>
    </div>
    <footer class="footer">
      <ul>
        <li><a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ config.icp }}</a></li>
      </ul>
      <ul>
        <li>Powered by <a href="https://gitee.com/wzmgit/danmu-mobile" target="_blank">wzmgit/vue-danmu</a></li>
      </ul>
    </footer>
  </div>
</template>

<script>
import config from "@/utils/config.js";
import { getVideoList } from "@/api/video";
import { getCarousel } from "@/api/carousel.js";
import HeaderBar from "@/components/HeaderBar.vue";
import VideoList from "@/components/VideoList.vue";
export default {
  name: "Home",
  data() {
    return {
      carousel: [],
      config: config,
      videoList: [],
      page: 1,
      flag: true, //视频在第一页
      loadingMore:false,
      busy:false,//不允许加载更多
    };
  },
  methods: {
    _getCarousel() {
      getCarousel().then((res) => {
        if (res.data.code === 2000) {
          this.carousel = res.data.data.carousels;
        }
      });
    },
    _getVideoList() {
      getVideoList(this.page, 6).then((res) => {
        console.log("加载")
        if (res.data.code === 2000) {
          if (this.flag) {
            this.videoList = res.data.data.videos;
            this.flag = false;
          } else {
            var newList = res.data.data.videos;
            if (newList.length == 0) {
              this.$message.info("没有更多了");
              this.busy = true;
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
      this._getVideoList();

    },
  },
  created() {
    this._getCarousel();
    this._getVideoList();
  },
  components: {
    "header-bar": HeaderBar,
    "video-list": VideoList,
  },
};
</script>

<style scoped>
.carousel-img {
  height: 220px;
  width: 100%;
}

.transition {
  height: 32px;
  align-items: center;
  justify-content: space-between;
  margin-left: 10px;
  font-size: 18px;
}

.more{
  width: 100%;
  height: 40px;
  text-align: center;
}

.footer {
  width: 100%;
  height: 80px;
  text-align: center;
  background-color: #f6f7f8;
}

.footer > ul {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 10px 0 0 0;
}

.footer > ul > li{
  margin: 0 10px;
}

.footer > ul > li > a{
  color: rgba(0, 0, 0, 0.65);
}

.footer > ul > li > a:hover{
  text-decoration: underline;
}
</style>
