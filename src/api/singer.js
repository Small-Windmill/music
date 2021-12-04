import axios from './axios';

export function getSingerList() {
  return axios.get('/api/top/artists');
}
export function getSingerDetail(singerId) {
  return axios.get(`/api/artists?id=${singerId}`);
}
