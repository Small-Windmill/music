import axios from './axios';
// import jsonp from '../common/js/jsonp';

export function getRecommend() {
  // const url = '/api/getDigitalAlbumLists';
  // return jsonp(url);
  return axios.get('/banner');
}
export function getDiscList() {
  return axios.get('/personalized');
}

export function getSongList(id) {
  return axios.get(`/playlist/detail?id=${id}`);
}
