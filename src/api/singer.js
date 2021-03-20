import axios from 'axios';

export function getSingerList() {
  return axios.get('/api/getSingerList');
}
