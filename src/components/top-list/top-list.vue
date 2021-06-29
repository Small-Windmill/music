<template>
  <transition name="slide">
    <music-list :rank="true" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import musicList from '../music-list/music-list.vue';
import { getSongList } from '../../api/recommend';
import { ERR_OK } from '../../api/config';
import { createSong } from '../../common/js/song';

export default {
  name: 'top-list',
  components: { musicList },
  created() {
    this._getTopList();
  },
  computed: {
    title() {
      return this.topList.name;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return '';
    },
  },
  data() {
    return {
      topList: [],
      songs: [],
      rank: true,
    };
  },
  methods: {
    _getTopList() {
      getSongList(this.$route.params.id).then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.playlist;
          this.songs = this._normalizeSongs(this.topList.tracks);
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

<style lang="scss" scoped>
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s ease;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
