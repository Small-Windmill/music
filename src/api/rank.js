import axios from './axios';

export function getTopList() {
  return  axios.get('/api/toplist');
}
