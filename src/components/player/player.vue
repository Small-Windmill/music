<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="iconfont icon-back">&#xe614;</i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"  @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove"
        @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{'current':currentLineNum === index}" v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper" >
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i class="iconfont" :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="iconfont icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" class="iconfont" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="iconfont icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition class="mini" >
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>

        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <!-- 如果是个固定值则不需要加: -->
          <progress-circle :radius="radius" :percent="percent">
          <i @click.stop="togglePlaying" class="iconfont icon-play-mini icon-mini" :class=" miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="iconfont icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import animations from 'create-keyframe-animation';
import Lyric from 'lyric-parser';
import { prefixStyle } from '../../common/js/dom';
import ProgressBar from '../../base/progress-bar/progress-bar';
import ProgressCircle from '../../base/progress-circle/progress-circle';
import { playMode } from '../../common/js/config';
import { shuffle } from '../../common/js/util';
import Scroll from '../../base/scroll/scroll';

const transform = prefixStyle('transform');
const transitionDuration = prefixStyle('transitionDuration');
export default {
  name: 'player',
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: '',
    };
  },
  computed: {
    cdCls() {
      return this.playing ? 'play' : 'play-pause';
    },
    // eslint-disable-next-line vue/no-dupe-keys
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    miniIcon() {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    disableCls() {
      return this.songReady ? '' : 'disable';
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList',
    ]),
  },
  created() {
    this.touch = {};
  },
  methods: {
    back() {
      // 不能直接写this.fullScreen = false; 会弹出警告
      // 有了映射之后可以调用
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const { x, y, scale } = this.getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
        },
        60: {
          transform: 'translate3d(0,0,0) scale(1.1)',
        },
        100: {
          transform: 'translate3d(0,0,0) scale(1)',
        },
      };
      animations.registerAnimation({
        name: 'move',
        animation,
        // 预设 可以设置动画的间隔以及缓动
        presets: {
          duration: 400,
          easing: 'linear',
        },
      });
      animations.runAnimation(this.$refs.cdWrapper, 'move', done);
    },
    afterEnter() {
      animations.unregisterAnimation('move');
      this.$refs.cdWrapper.style.animation = '';
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s';
      const { x, y, scale } = this.getPosAndScale();
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener('transitionend', done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = '';
      this.$refs.cdWrapper.style.transform = '';
    },
    togglePlaying() {
      // 如果没有ready好的话就直接返回
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }

    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    next() {
      // 如果没有ready好的话就直接返回
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        // 因为是下一首歌，当前索引+1
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    prev() {
      // 如果没有ready好的话就直接返回 不能使用下面的逻辑实现功能
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    format(interval) {
      // 向下取整，想等于Math.floor()
      interval |= 0;
      // 获取分的部分
      const minute = interval / 60 | 0;
      // 获取秒的部分
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent;
      this.$refs.audio.currentTime = currentTime;
      if (!this.playing) {
        this.togglePlaying();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    changeMode() {
      // 有3种播放模式，每点击一次就改变它的mode
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        // 如果是顺序播放或者循环播放
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlaylist(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric);
        if (this.playing) {
          this.currentLyric.play();
        }
      }).catch(() => {
        this.currentLyric = null;
        this.playingLyric = '';
        this.currentLineNum = 0;
      });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    middleTouchStart(e) {
      this.touch.initiated = true;
      const touch = e.touches[0];
      // 记录X坐标和Y坐标
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      // 为什么要维护纵坐标呢，因为歌词滚动是用scroll是一个上下滚动的过程，当纵轴偏移大于横轴偏移时，就不应该左右移动
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      // 在滚动时，需要知道歌词列表滚动的宽度是多少。首先要记录在滚动过程中，middle-r距离右侧的宽度
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
      // 最大不超过0
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
      // lyricList实际上是个scroll组件，即vue组件，是没法直接操作dom，需要访问它的element才能访问dom
      // 滑动的比例=列表向左宽度的宽度/整个屏幕的宽度
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
      // percent越大，透明度就越小
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style[transitionDuration] = 0;
    },
    middleTouchEnd() {
      let offsetWidth;
      let opacity;
      // 歌词页面从右向左滑
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = 'lyric';
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else { // 从左向右滑
      // 如果滑超过10%就要偏移回去
        // eslint-disable-next-line no-lonely-if
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          opacity = 1;
          this.currentShow = 'cd';
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const time = 300;
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
      // 加点动画效果，使得滑动效果不再生硬
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = `${time}ms`;
    },
    _pad(num, n = 2) {
      // 这个函数的功能就是补到几位，用0去补位
      let len = num.toString().length;
      while (len < n) {
        num = `0${num}`;
        len++;
      }
      return num;
    },
    getPosAndScale() {
      const targetWidth = 40;
      // mini-player专辑图片中心点偏移x 40像素
      const paddingLeft = 40;
      // mini-player专辑图片中心点离底部有30像素
      const paddingBottom = 30;
      // 大专辑图片离顶部有80像素
      const paddingTop = 80;
      // 大专辑图片宽度是窗口的80%
      const width = window.innerWidth * 0.8;
      // 初始的缩放比例
      const scale = targetWidth / width;
      // 初始的x坐标
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x, y, scale,
      };
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
    }),
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return;
      }
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      setTimeout(() => {
        this.$refs.audio.play().catch((error) =>  {
          this.togglePlaying();
          // eslint-disable-next-line no-alert
          alert('播放出错,暂无该歌曲资源');
        }, 1000);
        // 这里不直接调用currentSong.getLyric（）
        this.getLyric();
      });
    },
    playing(newPlaying) {
      const { audio } = this.$refs;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    },
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
  },
};
</script>
<style lang="scss" scoped>
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background-color: $color-background;

      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }

      .top {
        position: relative;
        margin-bottom: 25px;

        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;

          .icon-back {
            display: block;
            padding: 9px;
            font-size: $font-size-large-x;
            color: $color-theme;
            transform: rotate(-90deg);
          }
        }

        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;

          @include no-wrap();

          font-size: $font-size-large;
          color: $color-text;
        }

        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }

      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        // 规定段落中的文本不进行换行
        white-space: nowrap;
        font-size: 0;

        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;

          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;

            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;

              &.play {
                animation: rotate 20s linear infinite;
              }

              &.pause {
                animation-play-state: paused;
              }

              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }

          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;

            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }

        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;

          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;

            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;

              &.current {
                color: $color-text;
              }
            }
          }
        }
      }

      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;

        .dot-wrapper {
          text-align: center;
          font-size: 0;

          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;

            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }

        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0 auto;
          padding: 10px 0;

          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;

            &.time-l {
              text-align: left;
            }

            &.time-r {
              text-align: right;
            }
          }

          .progress-bar-wrapper {
            flex: 1;
          }
        }

        .operators {
          display: flex;
          align-items: center;

          .icon {
            flex: 1;
            color: $color-theme;

            &.disable {
              color: $color-theme-d;
            }

            i {
              font-size: 30px;
            }
          }

          .i-left {
            text-align: right;
          }

          .i-center {
            padding: 0 20px;
            text-align: center;

            i {
              font-size: 40px;
            }
          }

          .i-right {
            text-align: left;
          }

          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }

      &.normal-enter-active,
      &.normal-leave-active {
        transition: all 0.4s;

        .top,
        .bottom {
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }

      &.normal-enter,
      &.normal-leave-to {
        opacity: 0;

        .top {
          transform: translate3d(0, -100px, 0);
        }

        .bottom {
          transform: translate3d(0, 100px, 0);
        }
      }
    }

    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: $color-highlight-background;

      &.mini-enter-active,
      &.mini-leave-active {
        transition: all 0.4s;
      }

      &.mini-enter,
      &.mini-leave-to {
        opacity: 0;
      }

      .icon {
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;

        img {
          border-radius: 50%;

          &.play {
            animation: rotate 10s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
        }
      }

      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;

        .name {
          margin-bottom: 2px;

          @include no-wrap();

          font-size: $font-size-medium;
          color: $color-text;
        }

        .desc {
          @include no-wrap();

          font-size: $font-size-small;
          color: $color-text-d;
        }
      }

      .control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;

        .icon-play-mini,
        .icon-pause-mini,
        .icon-playlist {
          font-size: 30px;
          color: $color-theme-d;
        }

        .icon-mini {
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>
