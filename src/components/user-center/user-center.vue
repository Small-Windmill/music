<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="iconfont icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div class="play-btn" ref="playBtn" @click="random">
        <i class="iconfont icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex === 0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex === 1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Scroll from '../../base/scroll/scroll.vue';
import SongList from '../../base/song-list/song-list.vue';
import Switches from '../../base/switches/switches.vue';
import Song from '../../common/js/song';
import { playlistMixin } from '../../common/js/mixin';
import NoResult from '../../base/no-result/no-result.vue';

export default {
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        { name: '我喜欢的' },
        { name: '最近听的' },
      ],
    };
  },
  computed: {
    noResult() {
      // 判断在哪个tab下
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      } else {
        return !this.playHistory.length;
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲';
      } else {
        return '你还没有听过歌曲';
      }
    },
    ...mapGetters([
      'favoriteList',
      'playHistory',
    ]),
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.listWrapper.style.bottom = bottom;
      // 不能直接调用refresh，因为scroll用的是v-if，它是有可能不存在的
      this.$refs.favoriteList && this.$refs.favoriteList.refresh();
      this.$refs.playList && this.$refs.playList.refresh();
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song) {
      // 这里的song也是从缓存拿出来的，需要实例化
      this.insertSong(new Song(song));
    },
    back() {
      // 回到上一级
      this.$router.back();
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
      // 如果list 为空时什么都不做
      if (list.length === 0) {
        return;
      }
      // list也不是Song的实例,需要去封装实例化
      list = list.map((song) => {
        return new Song(song);
      });
      this.randomPlay({
        list,
      });
    },
    ...mapActions([
      'insertSong',
      'randomPlay',
    ]),
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult,

  },
};
</script>

<style lang="scss">
.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;

  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .switches-wrapper {
    margin: 10px 0 30px 0;
  }

  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 100px;
    font-size: 0;

    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;
    }

    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-small;
    }
  }

  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        padding: 20px 30px;
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
