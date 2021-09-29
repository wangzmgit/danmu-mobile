<template>
  <div>
    <div class="comment-item" v-for="(item, index) in commentList" :key="index">
      <!--一级评论-->
      <div class="comment-first">
        <!--头像和昵称-->
        <div class="info">
          <div style="margin-left: 5px">
            <a-avatar :size="40" :src="item.avatar" />
          </div>
          <div class="c-first-name">
            <span>{{ item.name }}</span>
          </div>
          <p class="c-first-date">{{ item.created_at | toTime }}</p>
        </div>
        <!--评论内容-->
        <div class="c-first-content">
          <span>{{ item.content }}</span>
        </div>
      </div>
      <!--二级评论-->
      <div class="c-second" v-for="(reply, i) in item.reply" :key="i">
        <!--头像和昵称-->
        <div class="info">
          <div class="reply-face">
            <a-avatar :size="30" :src="reply.avatar" />
          </div>
          <div class="c-second-name">
            <span>{{ reply.name }}</span>
          </div>
          <p class="c-second-date">{{ reply.created_at | toTime }}</p>
        </div>
        <!--二级评论内容-->
        <div class="c-second-content">
          <span style="color: #00a1d6; cursor: pointer">@{{ reply.reply_name }}</span>
          <span>&nbsp;{{ reply.content }}</span>
        </div>
        <!--分割线-->
        <div v-show="i != item.reply.length - 1" class="divider"/>
      </div>
    </div>
    <div v-if="more" class="more">
      <a-spin v-if="loadingMore" />
      <a-button v-else @click="getMore()">加载更多...</a-button>
    </div>
  </div>
</template>

<script>
import { toRelativeTime } from "@/utils/time";
import { getCommentList } from "@/api/comment";
export default {
  props: {
    vid: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      commentList: [],
      flag: true, //评论在第一页
      page: 1,
      page_size: 3,
      loadingMore: false,
      more: true, //允许加载更多
    };
  },
  methods: {
    getMore() {
      this.page++;
      this._getCommentList();
    },
    _getCommentList() {
      //获取评论
      getCommentList(this.vid, this.page, this.page_size).then((res) => {
        if (res.data.code === 2000) {
          if (this.flag) {
            if(res.data.data.comments.length == 0){
              this.more = false;
            }
            this.commentList = res.data.data.comments;
            this.flag = !this.flag;
          } else {
            var newList = res.data.data.comments;
            if (newList.length == 0) {
              this.$message.info("没有更多了");
              this.more = false;
            } else {
              this.commentList = this.commentList.concat(newList);
            }
          }
        } else {
          this.$message.error("评论获取失败");
        }
      });
    },
  },
  created() {
    this._getCommentList();
  },
  filters: {
    toTime(time) {
      return toRelativeTime(time);
    },
  },
};
</script>

<style scoped>
.info {
  margin-top: 10px;
  position: relative;
}

.comment-item {
  border-bottom: 1px solid #e7e7e7;
}

.comment-first {
  border-bottom: 1px solid #e7e7e7;
}

.c-first-name {
  position: absolute;
  color: #757575;
  font-size: 12px;
  left: 50px;
  top: 2px;
}

.c-first-date {
  position: absolute;
  font-size: 10px;
  left: 50px;
  top: 20px;
}

.c-first-content {
  margin: 5px 0 10px 50px;
}

.reply-face {
  margin-left: 50px;
}

.c-second-name {
  position: absolute;
  left: 90px;
  top: 0;
  color: #2e2e2e;
  font-size: 10px;
}

.c-second-date {
  position: absolute;
  font-size: 8px;
  left: 90px;
  top: 16px;
  width: 80px;
}

.c-second-content {
  margin: 8px 0 8px 85px;
}

.divider{
  margin-left: 60px;
  border-bottom: 1px solid #e7e7e7;
}

.more{
  width: 100%;
  text-align: center;
}
</style>