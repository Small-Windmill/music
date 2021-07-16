import axios from './axios';

export function getSingerList() {
  return axios.get('/top/artists');
}
export function getSingerDetail(singerId) {
  return axios.get(`/artists?id=${singerId}`);
}
