<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="iconfont icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
          <i class="iconfont icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType"  :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :rank="rank" @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Scroll from '../../base/scroll/scroll';
import SongList from '../../base/song-list/song-list';
import { prefixStyle } from '../../common/js/dom';
import Loading from '../../base/loading/loading';
import { playlistMixin } from '../../common/js/mixin';

const RESERVED_HEIGHT = 40;
const transform = prefixStyle('transform');
export default {
  name: 'music-list',
  mixins: [playlistMixin],
  components: {
    Scroll,
    SongList,
    Loading,
  },
  props: {
    bgImage: {
      type: String,
      default: '',
    },
    songs: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
    title: {
      type: String,
      default: '',
    },
    rank: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    },
  },
  data() {
    return {
      scrollY: 0,
    };
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.list.$el.style.bottom = bottom;
      // 调用refresh()让scroll重新计算高度
      this.$refs.list.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index,
      });
    },
    random() {
      this.randomPlay({
        list: this.songs,
      });
    },
    ...mapActions([
      'selectPlay',
      'randomPlay',
    ]),
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY);
      let zIndex = 0;
      // 图片放大
      let scale = 1;
      // 图片模糊
      let blur = 0;
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
      const percent = Math.abs(newY / this.imageHeight);
      // 图片往下拉时
      if (newY > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20 * percent, 20);
      }
      // CSS高斯模糊属性 只有iphone看得到效果
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`;
      this.$refs.filter.style['webkiBackdrop-filter'] = `blur(${blur}px)`;
      // 滚到顶部时
      if (newY < this.minTranslateY) {
        zIndex = 10;
        // 由于bgImage是宽高比，所以要先把paddingTop设为0
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        this.$refs.playBtn.style.display = 'none';
      } else { // 还没滚动到顶部时
        this.$refs.bgImage.style.paddingTop = '70%';
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = '';
      }
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
    },
  },
};
</script>

<style lang="scss" scoped>
  .music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;

    .back {
      position: absolute;
      top: -1px;
      left: 0;
      z-index: 50;

      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }

    .title {
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;

      @include no-wrap();

      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }

    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      //设置旋转元素的基点位置
      transform-origin: top;
      background-size: cover;

      .play-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;

        .play {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
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
      }

      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }

    .bg-layer {
      position: relative;
      height: 100%;
      background: $color-background;
    }

    .list {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: $color-background;

      .song-list-wrapper {
        padding: 20px 30px;
      }

      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
