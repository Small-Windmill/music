import axios from 'axios';
import jsonp from '../common/js/jsonp';

export function getRecommend() {
  // const url = '/api/getDigitalAlbumLists';
  // return jsonp(url);
  return axios.get('/api/getDigitalAlbumLists');
}
