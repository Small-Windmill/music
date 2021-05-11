<template>
  <transition>
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import MusicList from '../music-list/music-list';
import { getSongList } from '../../api/recommend';
import { ERR_OK } from '../../api/config';
import { createSong } from '../../common/js/song';

export default {
  name: 'disc',
  components: {
    MusicList,
  },
  computed: {
    title() {
      return this.disc.name;
    },
    bgImage() {
      return this.disc.picUrl;
    },
    ...mapGetters([
      'disc',
    ]),
  },
  data() {
    return {
      songs: [],
    };
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList() {
      if (!this.disc.id) {
        this.$router.push('/recommend');
        return;
      }
      getSongList(this.disc.id).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.playlist.tracks);
          this.songs = this._normalizeSongs(res.playlist.tracks);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((musicData) => {
        if (musicData.id && musicData.al.id) {
          ret.push(createSong(musicData));
        }
      });
      console.log(ret);
      return ret;
    },
  },
};
</script>

<style lang="scss" scoped>
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
