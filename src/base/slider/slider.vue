<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active:currentPageIndex === index}" v-for="(item,index) in dots" :key="index">
      </span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import { addClass } from '../../common/js/dom';

export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true, // 设置循环状态
    },
    autoPlay: { // 自动播放
      type: Boolean,
      default: true,
    },
    interval: { // 轮播时间间隔
      type: Number,
      default: 4000,
    },
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0,
    };
  },
  mounted() {
    // 浏览器通常17ms刷新一次
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();

      if (this.autoPlay) {
        this._play();
      }
    }, 20);

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return;
      }
      this._setSliderWidth(true);
      this.slider.refresh();
    });
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    // 设置slider的宽度
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;

      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, 'slider-item');

        child.style.width = `${sliderWidth}px`;
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = `${width}px`;
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        // 允许横向滚动
        scrollX: true,
        // 不允许纵向滚动
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400,
        click: true,
      });

      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        if (this.loop) {
          pageIndex -= 1;
        }
        this.currentPageIndex = pageIndex;

        if (this.autoPlay) {
          clearTimeout(this.timer);
          this._play();
        }
      });
    },
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1;
      if (this.loop) {
        pageIndex += 1;
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400);
      }, this.interval);
    },
  },
};
</script>
<style lang="scss" scoped>
.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    //  white-space 属性设置处理元素内的空白
    // 空白指Space(空格)、Enter(回车)、Tab(制表符)
    // nowrap 所有空格、回车、制表符都合并成一个空格，文本不换行
    white-space: nowrap;

    .slider-item {
      float: left;

      /* 为元素设定的宽度和高度决定了元素的边框盒 */
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
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
}
</style>
