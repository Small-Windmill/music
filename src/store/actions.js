import * as types from './mutation-types';
import { playMode } from '../common/js/config';
import { shuffle } from '../common/js/util';
import {
  saveSearch, deleteSearch, clearSearch, savePlay,
} from '../common/js/cache';
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
export const insertSong = function ({ commit, state }, song) {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let { currentIndex } = state;
  // 记录当前歌曲
  let currentSong = playlist[currentIndex];
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song);
  // 因为是插入歌曲，所以索引+1
  currentIndex++;
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song);
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playlist.splice(fpIndex + 1, 1);
    }
  }
  // sequenceList应该要插入的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  // 查找sequenceList有没有这首歌
  let fsIndex = findIndex(sequenceList, song);
  // 插入歌曲
  sequenceList.splice(currentSIndex, 0, song);
  // 如果已经包含了这首歌
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }

  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
export const saveSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};
export const deleteSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};
export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};
export const deleteSong = function ({ commit, state }, song) {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let { currentIndex } = state;
  // 找到被删元素在playlist的索引
  let pIndex =  findIndex(playlist, song);
  // playlist通过索引删除元素
  playlist.splice(pIndex, 1);
  // 找到被删元素在sequenceList的索引
  let sIndex =  findIndex(sequenceList, song);
  // sequenceList通过索引删除元素
  sequenceList.splice(sIndex, 1);
  // 删除完之后需要做个判断:删除元素的索引是否在当前索引之后，如果在前则currentIndex要--；还有一种情况是删除的是最后一首歌
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--;
  }
  // 提交mutation
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  const playingState = playlist.length > 0;
  commit(types.SET_PLAYING_STATE, playingState);
  // 如果删完列表长度为空
  // if (!playlist.length) {
  //   // 把playingState置为false
  //   commit(types.SET_PLAYING_STATE, false);
  // } else {
  //   // 设置播放状态
  //   commit(types.SET_PLAYING_STATE, true);
  // }
};
export const deleteSongList = function ({ commit }) {
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
};
export const savePlayHistory = function ({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song));
};
