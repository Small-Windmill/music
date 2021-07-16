import axios from './axios';

export function getHotKey() {
  return axios.get('/search/hot');
}

export function search(query) {
  return axios.get(`/cloudsearch?keywords=${query}`);
}
