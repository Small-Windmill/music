<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="(item,index) in topList" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.coverImgUrl" />
          </div>
          <ul class="songlist">
            <li class="song">
              <h1>{{item.name}}</h1>
              <span>{{item.description}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getTopList } from '../../api/rank';
import { ERR_OK } from '../../api/config';
import Scroll from '../../base/scroll/scroll';
import Loading from '../../base/loading/loading';
import { playlistMixin } from '../../common/js/mixin';

export default {
  name: 'rank',
  mixins: [playlistMixin],
  created() {
    this._getTopList();
  },
  data() {
    return {
      topList: [],
    };
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.rank.style.bottom = bottom;
      // 调用refresh()让scroll重新计算高度
      this.$refs.toplist.refresh();
    },
    selectItem(item) {
      // 调用router的api
      this.$router.push({
        path: `/rank/${item.id}`,
      });
    },
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.list;
        }
      });
    },
  },
  components: {
    Scroll,
    Loading,
  },
};

</script>
<style lang="scss" scoped>
.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          @include no-wrap();

          line-height: 26px;
        }
      }

      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
