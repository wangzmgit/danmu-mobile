<template>
  <div v-title data-title="搜索">
    <div class="search">
      <a-input-search v-model="keywords" placeholder="搜索关键词~" @search="search()"/>
      <p @click="cancel()">取消</p>
    </div>
    <div class="result">
      <p>共找到{{ len }}条结果</p>
      <div class="card-list">
        <div class="card-box" v-for="(item, index) in videos" :key="index">
          <div class="card" @click="video(item.vid)">
            <img :src="item.cover" />
            <div class="result-title">
              <p v-html="keyHighlight(item.title)"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { searchVideo } from "@/api/search";
export default {
  data() {
    return {
      len: 0,
      videos: [],
      keywords: "",
    };
  },
  methods: {
    search() {
      this.$router.push({
        name: "Search",
        params: { keywords: this.keywords },
      });
    },
    _searchVideo() {
      searchVideo(this.keywords).then((res) => {
        if (res.data.code === 2000) {
          this.videos = res.data.data.videos;
          this.len = this.videos.length;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    keyHighlight(title) {
      title = title + "";
      var array = this.keywords.split(" ");
      var irreplaceable = '<font color="#409EFF"></font>';
      // 匹配关键字正则
      for (var i = 0; i < array.length; i++) {
        if (array[i] == "") {
          continue;
        }
        //防止替换掉替换过的内容
        if (irreplaceable.indexOf(array[i]) != -1) {
          continue;
        }
        var replaceReg = new RegExp(array[i], "g");
        var replaceString = '<font color="#409EFF">' + array[i] + "</font>";
        title = title.replace(replaceReg, replaceString);
      }
      return title;
    },
    //页面跳转
    video(vid) {
      this.$router.push({ name: "Video", params: { vid: vid } });
    },
    //取消搜索
    cancel(){
      this.$router.push({ name: "Home"});
    }
  },
  watch: {
    //监听路由是否变化
    $route(to, from) {
      if (to.params.keywords != from.params.keywords) {
        this.keywords = to.params.keywords;
        this._searchVideo(); //重新加载数据
      }
    },
  },
  created() {
    this.keywords = this.$route.params.keywords;
    this._searchVideo();
  },
};
</script>

<style scoped>
.search {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #1890ff;
  -webkit-box-shadow: 0px 0px 3px #c8c8c8;
  -moz-box-shadow: 0px 0px 3px #c8c8c8;
  box-shadow: 0px 0px 3px #c8c8c8;
}

.search>span{
  margin-left: 10px;
}

.search>p{
  width: 80px;
  margin: 0;
  color: #fff;
  font-size: 18px;
  text-align: center;
}

.result {
  background-color: #fff;
  margin: 10px 10px;
}

.card-list {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.card-box {
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

.result-title {
  position: absolute;
  bottom: 0;
  height: 80px;
  width: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), transparent);
}

.result-title > p {
  position: absolute;
  bottom: 0;
  font-size: 14px;
  color: #fff;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>