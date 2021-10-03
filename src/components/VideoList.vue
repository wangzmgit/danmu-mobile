<template>
  <div class="card-list">
    <div class="v-card" v-for="(item, index) in list" :key="index">
      <div class="card" @click="video(item.vid)">
        <img :src="item.cover" />
        <div class="title">
          <p>{{ item.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    list: {
      type: Array,
      default: null,
    },
  },
  methods: {
    //页面跳转
    video(vid) {
      this.$router.push({ name: "Video", params: { vid: vid } });
    },
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
</style>