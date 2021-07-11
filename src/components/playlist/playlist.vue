<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon iconfont" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="iconfont icon-clear"></i></span>
          </h1>
        </div>
        <scroll :data="sequenceList" class="list-content" ref="listContent" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li ref="listItem" class="item" v-for="(item,index) in sequenceList" :key="index" @click="selectItem(item,index)">
              <i class="iconfont current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}} - {{item.singer}}</span>
              <span class="like">
                <i class="iconfont icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="iconfont icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="iconfont icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex';
import Scroll from '../../base/scroll/scroll.vue';
import { playMode } from '../../common/js/config';
import Confirm from '../../base/confirm/confirm.vue';
import { playerMixin } from '../../common/js/mixin';
import AddSong from '../add-song/add-song.vue';

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false,
      refreshDelay: 100,
    };
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环';
    },
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play';
      }
      return '';
    },
    selectItem(item, index) {
      // 调用mutation去set currentIndex
      // 播放模式为随机播放的话,index需要重新设置
      if (this.mode === playMode.random) {
        // 找到当前元素在playlist的索引
        index = this.playlist.findIndex((song) => {
          return song.id === item.id;
        });
      }
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    scrollToCurrent(current) {
      // 找到当前元素current在sequenceList的索引
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id;
      });
      // 根据索引滚动对应的列表元素
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },
    deleteOne(item) {
      this.deleteSong(item);
      if (!this.playlist.length) {
        this.hide();
      }
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    confirmClear() {
      this.deleteSongList();
      this.hide();
    },
    addSong() {
      this.$refs.addSong.show();
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList',
    ]),
  },
  watch: {
    currentSong(newSong, oldSong) {
      // 如果组件不显示或者歌曲没有被切换
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      }
      this.scrollToCurrent(newSong);
    },
  },
  components: {
    Scroll,
    Confirm,
    AddSong,
  },
};
</script>

<style lang="scss"  scoped >
.playlist {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background: $color-background-d;

  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .clear {
          @include extend-click();

          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter,
        &.list-leave-to { height: 0; }

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }

        .text {
          flex: 1;

          @include no-wrap();

          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .like {
          @include extend-click();

          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          @include extend-click();

          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }

    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-left: 5px;
          font-size: $font-size-small-s;
          padding-right: 5px;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
