<template>
  <div class="home">
    <a-affix>
     <header-bar></header-bar>
    </a-affix>
    <a-carousel :autoplay="true">
      <div v-for="(item, index) in carousel" :key="index">
        <img class="carousel-img" :src="item.img" />
      </div>
    </a-carousel>
    <div class="transition">
      <span>视频列表</span>
    </div>
    <!--视频列表-->
    <video-list></video-list>
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
import { getCarousel } from "@/api/carousel.js";
import HeaderBar from "@/components/HeaderBar.vue";
import VideoList from "@/components/VideoList.vue";
export default {
  name: "Home",
  data() {
    return {
      carousel: [],
      config: config,
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
  },
  created() {
    this._getCarousel();
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
