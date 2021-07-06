<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li @click="selectItem(item)" class="search-item" v-for="(item,index) in searches" :key="index">
        <span class="text">{{item}}</span>
        <!-- .stop防止冒泡事件触发到上面的click -->
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="iconfont icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item);
    },
    deleteOne(item) {
      this.$emit('delete', item);
    },
  },
};

</script>
<style scoped lang="scss">
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;

    &.list-enter-active,
    &.list-leave-active {
      transition: all 0.1s;
    }

    &.list-enter,
    &.list-leave-to {
      height: 0;
    }

    .text {
      flex: 1;
      color: $color-text-l;
    }

    .icon {
      @include extend-click();

      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>
