import storage from 'good-storage';

const SEARCH_KEY = '__search__';
// 最大只能存15条数据
const SEARCH_MAX_LENGTH = 15;

const PLAY_KEY = '__play__';
// 存储最近播放的200首歌曲
const PLAY_MAX_LENGTH = 200;

const FAVORITE_KEY = '__favorite__';
const FAVORITE_MAX_LENGTH = 200;

// 添加方法：最新的搜索结果总是展现在最前面
function insertArray(arr, val, compare, maxLen) {
  // 查找数据是否存在在数组中
  const index = arr.findIndex(compare);
  if (index === 0) { // 有该数据且为数组的第一条数据
    return;
  }
  if (index > 0) { // 数组有这条数据但不是第一条
    arr.splice(index, 1);// 删掉之前的数据
  }
  // 插到数组的第一个位置
  arr.unshift(val);
  // 限制数组长度
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}
// 利用第三方库保存搜索结果
export function saveSearch(query) {
  // 获取缓存中的search列表
  let searches = storage.get(SEARCH_KEY, []);
  // 把query插入当前历史列表中
  insertArray(searches, query, (item) => {
    return item === query;
  }, SEARCH_MAX_LENGTH);
  // 插入完之后保存
  storage.set(SEARCH_KEY, searches);
  // 返回新数组
  return searches;
}
export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}
// 删除方法
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}
export function deleteSearch(query) {
  // 获取缓存中的search列表
  let searches = storage.get(SEARCH_KEY, []);
  // 删除
  deleteFromArray(searches, (item) => {
    return item === query;
  });
  // 保存
  storage.set(SEARCH_KEY, searches);
  // 返回
  return searches;
}
export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, []);
  insertArray(songs, song, (item) => {
    // 比较函数： 如果song在里面的话，就挪到前面去
    return item.id === song.id;
  }, PLAY_MAX_LENGTH);
  storage.set(PLAY_KEY, songs);
  return songs;
}
export function loadPlay() {
  return storage.get(PLAY_KEY, []);
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, []);
  insertArray(songs, song, (item) => {
    return song.id === item.id;
  }, FAVORITE_MAX_LENGTH);
  storage.set(FAVORITE_KEY, songs);
  return songs;
}
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, []);
  deleteFromArray(songs, (item) => {
    return song.id === item.id;
  });
  storage.set(FAVORITE_KEY, songs);
  return songs;
}
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, []);
}
