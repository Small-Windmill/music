<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item,index) in switches" :key="index" :class="{'active':currentIndex === index}" @click="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
  // 标题
    switches: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
    // 索引
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    switchItem(index) {
      this.$emit('switch', index);
    },
  },
};
</script>

<style lang="scss">
.switches {
  display: flex;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid $color-highlight-background;
  border-radius: 5px;

  .switch-item {
    flex: 1;
    padding: 8px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text-d;

    &.active {
      background: $color-highlight-background;
      color: $color-text;
    }
  }
}
</style>
