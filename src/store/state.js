import { playMode } from '../common/js/config';

const state = {
  singer: {},
  // 播放状态默认为暂停
  playing: false,
  // 播放器默认为收起
  fullScreen: false,
  // 播放列表
  playlist: [],
  // 顺序列表
  sequenceList: [],
  // 播放模式默认为顺序播放
  mode: playMode.sequence,
  // 当前播放索引
  currentIndex: -1,
  // 歌单对象
  disc: {},
};
export default state;
