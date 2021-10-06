<template>
  <div >
    <div class="comment-item" v-for="(item, index) in replyList" :key="index">
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
          <span style="color:#00a1d6">@{{ item.reply_name }}</span>
          <span>&nbsp;{{ item.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toRelativeTime } from "@/utils/time";
export default {
  props: {
    replyList: {
      type: Array,
      default: null,
    },
  },
  methods: {
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

</style>