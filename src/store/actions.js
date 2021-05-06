import * as types from './mutation-types';
import { playMode } from '../common/js/config';
import { shuffle } from '../common/js/util';
// 选择播放

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  });
}

export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    let randomlist = shuffle(list);
    commit(types.SET_PLAYLIST, randomlist);
    index = findIndex(randomlist, list[index]);
  } else {
    commit(types.SET_PLAYLIST, list);
  }

  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
// randomPlay这里是没有索引的
export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  // 洗牌歌曲
  let randomlist = shuffle(list);
  commit(types.SET_PLAYLIST, randomlist);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
