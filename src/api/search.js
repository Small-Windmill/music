import axios from './axios';

export function getHotKey() {
  return axios.get('/api/search/hot');
}

export function search(query) {
  return axios.get(`/api/cloudsearch?keywords=${query}`);
}
