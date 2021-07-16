<template>
  <transition name="slide">
    <music-list v-if="show" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import { getSingerDetail } from '../../api/singer';
import { ERR_OK } from '../../api/config';
import { createSong } from '../../common/js/song';
import musicList from '../music-list/music-list.vue';

export default {
  components: { musicList },
  name: 'singer-detail',
  data() {
    return {
      show: false,
      songs: [],
    };
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters([
      'singer',
    ]),
  },
  created() {
    setTimeout(() => {
      this.show = true;
    }, 20);
    this._getDetail();
  },
  methods: {
    _getDetail() {
      // 用户刷新时，mapGetters获取到的singer为空 需要回退歌手列表页
      if (!this.singer.id) {
        this.$router.push('/singer');
        return;
      }
      getSingerDetail(this.singer.id).then((res) => {
        console.log(res);
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.hotSongs);
          console.log(this.songs);
        }

      });
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
  },
};
</script>

<style lang="scss">

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);//100% 完全移动到屏幕右侧 动画开始后向左滑入
}

</style>
