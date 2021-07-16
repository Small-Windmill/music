import axios from './axios';

export function getLyric(id) {
  return axios.get(`/lyric?id=${id}`);
}
