<template>
 <div class="recommend">
   <scroll ref="scroll" class="recommend-content" :data="discList">
    <div>
       <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="item in recommends" :key="item.actid">
              <a :href="item.jumpurl">
                <img class="needsclick" @load="loadImage" :src="item.picurl" >
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item" :key="item.content_id">
              <div class="icon">
                <img v-lazy="item.cover" width="70" height="70">
              </div>
              <div class="text">
                <h2 class="name" v-text="item.title"></h2>
                <p class="desc">播放量: {{item.listen_num | filter}}</p>
              </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="loading-container" v-show="!discList.length">
      <loading></loading>
    </div>
   </scroll>
 </div>
</template>

<script>
import Loading from '../../base/loading/loading';
import Scroll from '../../base/scroll/scroll';
import Slider from '../../base/slider/slider';
import { getRecommend, getDiscList } from '../../api/recommend';
import { ERR_OK } from '../../api/config';

export default {
  filters: {
    filter(num) {
      // 根据真实数据计算出显示的字符串
      // ().toFixed(n)四舍五入取n位小数，运算后得到的是字符串
      if (num > 10000) return `${(num / 10000).toFixed(1)}万`;
      return num;
    },
  },
  components: {
    Slider,
    Scroll,
    Loading,
  },
  data() {
    return {
      recommends: [],
      discList: [],
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        res = res.data.response;
        if (res.code === ERR_OK) {
          this.recommends = res.data.banner;
          console.log(res.data.banner);
        }
      });
    },
    _getDiscList() {
      getDiscList().then((res) => {
        res = res.data.response.recomPlaylist;
        if (res.code === ERR_OK) {
          this.discList = res.data.v_hot;
          console.log(res.data.v_hot);
        }
      });
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }

    },
  },
};

</script>
<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          //flex 属性用于设置或检索弹性盒模型对象的子元素如何分配空间。
          // flex 属性是 flex-grow、flex-shrink 和 flex-basis 属性的简写属性。
          // 项目将相对于其他灵活的项目进行扩展的量、收缩的量、项目的长度
          flex: 0 0 70px;
          width: 70px;
          padding-right: 22px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50;
      // 实现元素垂直居中效果
      // 让div 沿Y轴平移自身高度的一半
      transform: translateY(-50%);
    }
  }
}
</style>
