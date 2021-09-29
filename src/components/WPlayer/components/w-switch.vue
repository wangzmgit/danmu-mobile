<template>
  <div class="switch" @click="openSwitch()">
    <div class="switch-bg" :class="openClass">
      <span class="text" v-show="open">弹</span>
      <div class="switch-btn" :class="openClass"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: true,
    };
  },
  methods: {
    openSwitch() {
      this.open = !this.open;
      this.$emit("change", this.open);
    },
  },
  computed: {
    openClass() {
      if (this.open) {
        return "open";
      }
      return "";
    },
  },
};
</script>

<style scoped>
.switch {
  position: relative;
  width: 44px;
  height: 22px;
  border-radius: 22px;
  border: 1px solid #e9e9e9;
  cursor: pointer;
}

.switch-btn {
  position: absolute;
  top: -1px;
  left:-3px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #e9e9e9;
  transition: left 0.5s;
  -moz-transition: left 0.5s; /* Firefox 4 */
  -webkit-transition: left 0.5s; /* Safari and Chrome */
  -o-transition: left 0.5s; /* Opera */
}

.switch-bg {
  background-color: #409eff;
  width: 20px;
  height: 22px;
  border-radius: 50px;
  transition: width 0.5s;
  -moz-transition: width 0.5s; /* Firefox 4 */
  -webkit-transition: width 0.5s; /* Safari and Chrome */
}

.text {
  position: absolute;
  color: #fff;
  left: 6px;
}

.switch-btn.open {
  left: 22px;
}

.switch-bg.open {
  width: 44px;
}
</style>
