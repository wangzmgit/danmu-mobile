<template>
  <div >
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
        <div class="reply-box" v-if="item.reply.length">
          <div v-for="(reply, i) in item.reply" :key="i">
            <div class="reply-content">
              <span class="reply-name">{{ reply.name }}&nbsp;</span>
              <span>回复&nbsp;@{{ reply.reply_name }}</span>
              <span>&nbsp;{{ reply.content }}</span>
            </div>
          </div>
          <div @click="showReply(item.cid)">
            <p v-if="item.reply_count == 0">展开回复<a-icon type="right" /></p>
            <p v-else>共{{item.reply_count}}条回复<a-icon type="right" /></p>
          </div>
        </div>
      </div>
    </div>
    <div v-show="loadingMore" class="more">
      <a-spin />
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
      page_size: 10,
      loadingMore: false,
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
            this.page = 5;//第一次获取10条，之后每次获取5条
            this.flag = false;
          } else {
            var newList = res.data.data.comments;
            if (newList.length == 0) {
              this.$message.info("没有更多了");
              this.$parent.noMore();
            } else {
              this.commentList = this.commentList.concat(newList);
            }
          }
        } else {
          this.$message.error("评论获取失败");
        }
      });
    },
    showReply(cid){
      this.$parent.showReplyList(cid)
    }
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
  margin: 5px 10px 10px 50px;
}

.reply-box{
  color: #212121;
  margin: 0 10px 10px 50px;
  padding: 5px 10px;
  background-color: #f4f4f4;
}

.reply-name{
  color: #00a1d6;
}

.reply-box>div>p{
  margin: 4px 0;
  color: #00a1d6;
}

.more{
  width: 100%;
  text-align: center;
}
</style>