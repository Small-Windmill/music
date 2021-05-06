import { mapGetters, mapMutations, mapActions } from 'vuex';
// eslint-disable-next-line import/named
import { playMode } from './config';
import { shuffle } from './util';

export const playlistMixin = {
  computed: {
    // 通过getters拿到playlist
    ...mapGetters([
      'playlist',
    ]),
  },
  mounted() {
    this.handlePlaylist(this.playlist);
  },
  activated() {
    this.handlePlaylist(this.playlist);
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal);
    },
  },
  methods: {
    handlePlaylist() {
      // 具体方法要到具体组件实现
      // 抛个异常，组件必须实现这个函数，一旦组件定义这个函数，它就会覆盖mixin里的这个函数。如果没有则调用mixin里的这个函数
      throw new Error('component must implement handlePlaylist method');
    },
  },
};
export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode',
      'favoriteList',
    ]),
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
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
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite';
      }
      return 'icon-not-favorite';
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id;
      });
      return index > -1;
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList',
    ]),
  },
};

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120,
    };
  },
  computed: {
    ...mapGetters([
      'searchHistory',
    ]),
  },
  methods: {
    onQueryChange(query) {
      this.query = query;
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
    ]),
  },
};
