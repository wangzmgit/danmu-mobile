<template>
  <button :class="['w-button', type]" :disabled="disabled" @click="handleClick()">
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: "w-button",
  props: {
    type: {
      type: String,
      default: "primary",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick(data) {
      this.$emit("click", data);
    },
  },
};
</script>

<style scoped>
.w-button {
  font-weight: 400;
  font-size: 14px;
  height: 32px;
  outline: none;
  cursor: pointer;
  padding: 0 15px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
}

button[disabled] {
  opacity: 0.6;
  cursor: default;
}

.primary {
  color: #fff;
  background: #1890ff;
  border-color: #1890ff;
}

.primary:hover{
  background: #40a9ff;
  border-color: #40a9ff;
}

.text{
  color: #fff;
  background:transparent;
  border-color: transparent;
}
</style>
