<template>
 <div class="recommend" ref="recommend">
   <scroll ref="scroll" class="recommend-content" :data="discList">
    <div>
       <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="(item,index) in recommends" :key="index">
              <a :href="item.url">
                <img class="needsclick" @load="loadImage" :src="item.imageUrl" >
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="item in discList" class="item" :key="item.id">
              <div class="icon">
                <img v-lazy="item.picUrl" width="70" height="70">
              </div>
              <div class="text">
                <h2 class="name" v-text="item.name"></h2>
                <p class="desc">播放量: {{item.playCount | filter}}</p>
              </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="loading-container" v-show="!discList.length">
      <loading></loading>
    </div>
   </scroll>
   <router-view></router-view>
 </div>
</template>

<script>
import { mapMutations } from 'vuex';
import Loading from '../../base/loading/loading';
import Scroll from '../../base/scroll/scroll';
import Slider from '../../base/slider/slider';
import { getRecommend, getDiscList } from '../../api/recommend';
import { ERR_OK } from '../../api/config';
import { playlistMixin } from '../../common/js/mixin';

export default {
  mixins: [playlistMixin],
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
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.recommend.style.bottom = bottom;
      // 调用refresh()让scroll重新计算高度
      this.$refs.scroll.refresh();
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.id}`,
      });
      this.setDisc(item);
      console.log(item);
    },
    _getRecommend() {
      console.log('111');
      getRecommend().then((res) => {
        console.log(res);
        if (res.code === ERR_OK) {
          this.recommends = res.banners;
        }
      });
    },
    _getDiscList() {
      getDiscList().then((res) => {
        // res = res.data.response.recomPlaylist;
        // if (res.code === ERR_OK) {
        //   this.discList = res.data.v_hot;
        //   console.log(res.data.v_hot);
        // }
        console.log(res.result);
        if (res.code === ERR_OK) {
          this.discList = res.result;
        }
      });
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }

    },
    ...mapMutations({
      setDisc: 'SET_DISC',
    }),
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
          line-height: 24px;
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
