<template>
  <scroll class="suggest" :data="result" :beforeScroll="beforeScroll" @beforeScroll="listScroll" ref="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <i class="iconfont icon-music"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
    <div v-show="!result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import { mapActions } from 'vuex';
import { search } from '../../api/search';
import { ERR_OK } from '../../api/config';
import Scroll from '../../base/scroll/scroll.vue';
import { createSong } from '../../common/js/song';
import NoResult from '../../base/no-result/no-result.vue';

export default {
  name: 'name',
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      result: [],
      beforeScroll: true,
    };
  },
  methods: {
    search() {
      // 请求服务端的检索数据
      search(this.query).then((res) => {
        if (res.data.code === ERR_OK) {
          // if (res.data.result.songCount === 0) {
          //   this.result = [];
          // } else {
          this.result = this._normalizeSongs(res.data.result.songs);
          // }

        }
      });
    },
    listScroll() {
      this.$emit('listScroll');
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((item) => {
        if (item.id && item.al.id) {
          ret.push(createSong(item));
        }
      });
      return ret;
    },
    getDisplayName(item) {
      return `${item.name} - ${item.singer}`;
    },
    selectItem(item) {
      this.insertSong(item);
      this.$emit('select');
    },
    refresh() {
      this.$refs.suggest.refresh();
    },
    ...mapActions([
      'insertSong',
    ]),

  },
  watch: {
    query() {
      this.search();
    },
  },
  components: {
    Scroll,
    NoResult,
  },
};

</script>
<style scoped lang="scss">
.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^="icon-"] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        @include no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
